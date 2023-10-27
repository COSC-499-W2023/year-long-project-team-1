/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */

import path from "path";
import { writeFile } from "fs/promises";
import { timeStampUTC } from "@lib/time";
import { JSONResponse } from "@lib/json";

const videosDirectory = process.env.PRIVACYPAL_INPUT_VIDEO_DIR || "/opt/privacypal/input_videos";

const allowedMimeTypes = [
    "video/mp4", // mp4
    "video/x-msvideo", // avi
    "video/quicktime", // mov
];

export async function POST(req: Request) {
    // retrieve user id, verify authenticated
    // this will require user auth to be verified
    // TODO: link this with server-side user auth
    const userID = "12345678";

    // read the multipart/form-data
    const data = await req.formData();
    // get the file
    const file: File | null = data.get("file") as unknown as File;

    // if there was no file parameter, return 400 (bad request)
    if (!file) {
        return Response.json({ success: false }, { status: 400 });
    } else {
        console.log(`Next.js received file: ${file.name}`);
    }

    // extract the MIME type
    const fileMimeType = file.type;

    // if the MIME type is not allowed, return 415 (unsupported media type)
    // allowed MIME types are only common videos
    if (!allowedMimeTypes.includes(fileMimeType)) {
        console.log(`MIME type not allowed: ${fileMimeType}`);
        const res: JSONResponse = { errors: [{ status: "415", title: "Unsupported Media Type" }] };
        return Response.json(res, { status: 415 });
    }

    // read the file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // determine the path to write the file to
    const cwd = videosDirectory;
    const extension = path.extname(file.name);
    const fileBaseName = path.basename(file.name, extension);
    const filePath = path.join(cwd, `${userID}-${fileBaseName}-${timeStampUTC()}${extension}`);

    try {
        // write file to disk
        // file will be overwritten if it exists
        await writeFile(filePath, buffer);
        console.log(`file uploaded to: ${filePath}`);

        // return success with file path
        const res: JSONResponse = { data: { success: true } };
        return Response.json(res);
    } catch (err: any) {
        console.error(err);
        const res: JSONResponse = { errors: [{ status: "500", title: "Internal Server Error" }] };
        return Response.json(res, { status: 500 });
    }
}
