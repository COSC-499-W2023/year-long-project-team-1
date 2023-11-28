import path from "path";
import { writeFile } from "fs/promises";
import { timeStampUTC } from "@lib/time";
import { NextResponse } from "next/server";

const videosDirectory = process.env.PRIVACYPAL_INPUT_VIDEO_DIR || "/opt/privacypal/input_videos";

const allowedMimeTypes = [
    "video/mp4", // mp4
    "video/x-msvideo", // avi
    "video/quicktime", // mov
];

export async function POST(req: Request){
    // retrieve user id, verify authenticated
    // this will require user auth to be verified
    // TODO: get userID from getSession()
    const userID = "12345678";

    // read the multipart/form-data
    const data = await req.formData();
    // get the file
    const file: File = data.get("file") as File;

    // if there was no file parameter, return 400 (bad request)
    if (!file) {
        return Response.json({ message: "Video file is not found." }, { status: 400 });
    } else {
        console.log(`Next.js received file: ${file.name}`);
    }

    if (!fileIsValid(file)){
        return NextResponse.json({message: "Unsupported Media Type"}, {status: 415});
    }

    let filename: string
    try {
        filename = await saveVideo(file, userID)
    }catch(err){
        return Response.json({message: "Internal Server Error"}, {status: 500})
    }

    //TODO: extract to function
    let vidUrl = "http://localhost:3000/process_video?"
    let params = {
        filename: filename,
    }
    console.log(vidUrl + new URLSearchParams(params), {
        method: "POST",
    })
    let videoServerRes = await fetch(vidUrl + new URLSearchParams(params), {
        method: "POST",
    })
    
    if (videoServerRes.status == 202) {
        return Response.json({message:"Video is being processed", filePath: filename}, {status: 200})
    }else{
        // TODO: call the clean file function
        // TODO: print error message
        // console.log(videoServerRes.body)
        return Response.json({message: "Internal Server Error"}, {status: 500})
    }

}

function fileIsValid(file: File): boolean{
    // extract the MIME type
    const fileMimeType = file.type;

    // if the MIME type is not allowed, return 415 (unsupported media type)
    // allowed MIME types are only common videos
    if (!allowedMimeTypes.includes(fileMimeType)) {
        console.log(`MIME type not allowed: ${fileMimeType}`);
        return false
    }
    return true
}

async function saveVideo(file: File, userID: string): Promise<string> {
    // read the file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // determine the path to write the file to
    const cwd = videosDirectory;
    const extension = path.extname(file.name);
    // file name extracted from request
    const fileBaseName = path.basename(file.name, extension);
    // file name combined with userID and timestamp
    const filename = `${userID}-${fileBaseName}-${timeStampUTC()}${extension}`;
    const filePath = path.join(cwd, filename);

    try {
        // write file to disk
        // file will be overwritten if it exists
        await writeFile(filePath, buffer);
        console.log(`file uploaded to: ${filePath}`);
        return filename
    } catch (err: any) {
        console.error(err);
        throw err
    }
}
