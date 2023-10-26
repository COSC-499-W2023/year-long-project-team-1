/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */

import path from "path";
import { writeFile } from "fs/promises";

const videosDirectory = process.env.PRIVACYPAL_VIDEOS_DIRECTORY;

export async function POST(req: Request) {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return Response.json({ success: false });
    } else {
        console.log(`received file: ${file.name}`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cwd = videosDirectory ? videosDirectory : path.join(path.resolve(), "../back-end/video-processing/");
    const filePath = path.join(cwd, file.name);

    try {
        await writeFile(filePath, buffer);
        console.log(`file uploaded to: ${filePath}`);
        return Response.json({ success: true, filePath: filePath });
    } catch (err: any) {
        console.error(err);
        return Response.json({ success: false });
    }
}
