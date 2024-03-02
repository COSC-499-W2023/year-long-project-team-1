/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import db from "@lib/db";
import {
  JSONError,
  JSONErrorBuilder,
  JSONResponseBuilder,
  RESPONSE_NOT_AUTHORIZED,
} from "@lib/response";
import {
  getOutputBucket,
  deleteArtifactFromBucket,
  getTmpBucket,
  deleteObjectTags,
  getObjectMetaData,
} from "@lib/s3";
import { isInt } from "@lib/utils";
import { auth } from "src/auth";
import { UserRole } from "@lib/userRole";

enum ReviewAction {
  ACCEPT = "accept",
  REJECT = "reject",
  /**
   * TODO: Periodically prune input and processed videos.
   * Stale videos on servers post a data security concern.
   */
  NOOP = "noop",
}

interface RequestBody {
  apptId: string;
  filename: string;
  action: ReviewAction;
}

function isActionValid(action?: string): boolean {
  return (
    !!action &&
    Object.values<string>(ReviewAction).includes(action.toLowerCase())
  );
}

function validateBody({ apptId, filename, action }: RequestBody): JSONError[] {
  // FIXME: Error message should be reformatted with consitent styles.
  const errMessages: string[] = [];
  if (!apptId || !isInt(apptId)) {
    errMessages.push(
      !apptId
        ? "Appointment ID is required. Missing."
        : `Invalid Appointment ID: ${apptId}. Must be an interger.`,
    );
  }
  if (!filename) {
    errMessages.push("Filename is required. Missing.");
  }
  if (!isActionValid(action)) {
    errMessages.push(
      !action ? "Action is required. Missing." : `Invalid action: ${action}.`,
    );
  }
  return errMessages.map((mes) =>
    JSONErrorBuilder.from(400, "Invalid request body", mes),
  );
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();

  const session = await auth();

  if (session?.user.role !== UserRole.CLIENT) {
    // only allow clients to perform the video review option
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  const errors = validateBody(body);
  if (errors.length > 0) {
    return Response.json(
      JSONResponseBuilder.instance().errors(errors).build(),
      { status: 400 },
    );
  }

  const { apptId, filename: srcFilename, action } = body;
  const user = session.user;

  // Check if the appointment exists
  const appointment = await db.appointment.findUnique({
    where: {
      id: Number(apptId),
      clientUsrName: user.username,
    },
  });
  if (!appointment) {
    return Response.json(
      JSONResponseBuilder.from(
        400,
        JSONErrorBuilder.from(400, "Invalid Appointment ID or UID"),
      ),
      { status: 400 },
    );
  }

  // check if file exists in S3
  const exists = await getObjectMetaData({
    bucket: getOutputBucket(),
    key: srcFilename,
  });
  if (!exists) {
    return Response.json(
      JSONResponseBuilder.from(
        404,
        JSONErrorBuilder.from(
          404,
          "File does not exist",
          `${srcFilename} does not exist or is not yet processed.`,
        ),
      ),
      { status: 404 },
    );
  }

  const cleanupInputBucket = async () => {
    await deleteArtifactFromBucket({
      bucket: getTmpBucket(),
      key: srcFilename,
    });
  };

  const cleanupOutputBucket = async () => {
    await deleteArtifactFromBucket({
      bucket: getOutputBucket(),
      key: srcFilename,
    });
  };

  try {
    switch (action) {
      case ReviewAction.NOOP:
        break;
      case ReviewAction.REJECT:
        await cleanupInputBucket();
        await cleanupOutputBucket();
        await db.video.delete({
          where: {
            awsRef: srcFilename,
          },
        });
        break;
      case ReviewAction.ACCEPT:
        await cleanupInputBucket();
        await deleteObjectTags({ bucket: getOutputBucket(), key: srcFilename });
        await db.video.update({
          where: {
            awsRef: srcFilename,
          },
          data: {
            time: new Date(),
          },
        });
        break;
      default:
    }
    return Response.json(JSONResponseBuilder.instance().build(), {
      status: 200,
    });
  } catch (e: any) {
    return Response.json(
      JSONResponseBuilder.from(
        500,
        JSONErrorBuilder.from(
          500,
          "Failure while processing request",
          e.message || e,
        ),
      ),
      { status: 500 },
    );
  }
}
