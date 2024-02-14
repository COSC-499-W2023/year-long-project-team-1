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
import { getLoggedInUser } from "@app/actions";
import prisma from "@lib/db";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { createPresignedUrl, getOutputBucket } from "@lib/s3";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const param = searchParams.get("apptId");

  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // TODO: validate apptId is of type int
  if (!param) {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "Missing apptId.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  let apptId: number;
  try {
    apptId = parseInt(param);
  } catch {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "apptId must be of type number.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  // check if user has appointment of apptId
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: apptId,
      OR: [
        {
          clientUsrName: user.username,
        },
        {
          proUsrName: user.username,
        },
      ],
    },
  });

  if (!appointment) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  // Assuming each appointment is linked to only 1 video
  const videoRef = await prisma.video.findFirst({
    where: {
      apptId: apptId,
    },
  });

  // no videos linked to the appointment
  if (!videoRef) {
    return Response.json(`No video found for apptId ${apptId}`, {
      status: 200,
    });
  }

  const presignedURL = await createPresignedUrl({
    bucket: getOutputBucket(),
    key: videoRef.awsRef,
  });
  return new Response(presignedURL);
}
