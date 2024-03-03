import { getLoggedInUser } from "@app/actions";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { NextRequest, NextResponse } from "next/server";
import { createPresignedUrl, getOutputBucket } from "@lib/s3";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fileKey = searchParams.get("file");

  if (!fileKey) {
    const error: JSONResponse = {
      errors: [
        {
          status: 400,
          title: "Missing file parameter.",
        },
      ],
    };
    return Response.json(error, { status: 400 });
  }

  const user = await getLoggedInUser();
  if (!user) {
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
  }

  const url = await createPresignedUrl({
    bucket: getOutputBucket(),
    key: fileKey,
  });
  return NextResponse.json(
    {
      data: url,
    },
    { status: 200 },
  );
}
