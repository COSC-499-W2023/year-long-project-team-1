import { getLoggedInUser } from "@app/actions";
import prisma from "@lib/db";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { createPresignedUrl, getTmpBucket } from "@lib/s3";
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

  let apptId = parseInt(param);

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
    bucket: getTmpBucket(),
    key: videoRef.awsRef,
  });
  return new Response(presignedURL);
}
