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
import fs from "fs/promises";
import db from "@lib/db";
import {
  JSONError,
  JSONErrorBuilder,
  JSONResponseBuilder,
  RESPONSE_NOT_AUTHORIZED,
} from "@lib/response";
import { getSession } from "@lib/session";
import {
  generateObjectKey,
  getOutputBucket,
  uploadArtifactFromPath,
} from "@lib/s3";
import {
  getProcessedFilePath,
  getSrcFilePath,
  checkFileExist,
  isInt,
} from "@lib/utils";
import { auth } from "src/auth";

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

  // FIXME: Check if the authenticated user is authorized to perform this action.
  if (!session) {
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

  const srcFilePath = getSrcFilePath(srcFilename);
  const toUploadPath = getProcessedFilePath(srcFilename);
  // Check if the file exists and writable
  const exist = await checkFileExist(toUploadPath);
  if (!exist) {
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

  const cleanup = async () => {
    await fs.unlink(toUploadPath);
    await fs.unlink(srcFilePath);
  };

  try {
    switch (action) {
      case ReviewAction.NOOP:
        break;
      case ReviewAction.REJECT:
        await cleanup();
        break;
      case ReviewAction.ACCEPT:
        const { Location } = await uploadArtifactFromPath({
          bucket: getOutputBucket(),
          key: generateObjectKey(srcFilename, `${user.username}`),
          metadata: {
            apptId: `${apptId}`,
          },
          path: toUploadPath,
        });
        if (!Location) {
          throw Error("Video location is unknown");
        }
        await db.video.create({
          data: {
            apptId: Number(apptId),
            awsRef: Location,
          },
        });
        await cleanup();
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
