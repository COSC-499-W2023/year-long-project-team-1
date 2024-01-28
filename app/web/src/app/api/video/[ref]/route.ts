import { type NextRequest } from "next/server";
import db from "@lib/db";
import { getLoggedInUser } from "@app/actions";
import {
  JSONResponseBuilder,
  RESPONSE_INTERNAL_SERVER_ERROR,
  RESPONSE_NOT_AUTHORIZED,
  RESPONSE_NOT_FOUND,
  RESPONSE_OK,
} from "@lib/response";
import { deleteResource } from "@lib/s3";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ref: string } },
) {
  // appointment id from the url query
  const searchParams = req.nextUrl.searchParams;
  const apptId = searchParams.get("appt");

  // video id from the url params
  const videoRef = params.ref;

  // verify the user is in the appointment
  const user = await getLoggedInUser();

  // no user, not authorized
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  const userId = user?.id;

  // check if the video exists in the appointment
  const videoCount = await db.video.count({
    where: {
      AND: [
        { apptId: parseInt(apptId ?? "-1") },
        { awsRef: videoRef },
        {
          appt: {
            OR: [{ proId: userId }, { clientId: userId }],
          },
        },
      ],
    },
  });

  // no video found for this user's appointment
  if (videoCount !== 1) {
    return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
  }

  // delete the video
  try {
    await deleteResource(videoRef);
    return Response.json(RESPONSE_OK, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(RESPONSE_INTERNAL_SERVER_ERROR, { status: 500 });
  }
}
