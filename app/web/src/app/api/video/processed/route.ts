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

/**
 * This route is only a rudimentary file streaming route for testing purposes.
 * I'm not convinced it's actually streaming but instead fully downloading the file.
 *
 * TODO: figure out how to stream the file to the client and support HTTP range requests
 */

import fs from "fs";
import path from "path";

const videosDirectory = process.env.PRIVACYPAL_OUTPUT_VIDEO_DIR || "/opt/privacypal/output-videos";

export async function GET(req: Request) {
    // get the file name from the query string
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file") || "";
    const videoPath = path.join(videosDirectory, fileName);

    // check if the file exists
    if (!fs.existsSync(videoPath)) {
        return new Response("Video file not found", { status: 404 });
    }

    // get the file stats to determine its size
    const stat = fs.statSync(videoPath);

    // create response headers
    const headers = new Headers();
    headers.set("Content-Type", "video/mp4");
    headers.set("Content-Length", stat.size.toString());
    headers.set("Cache-Control", "public, max-age=31536000");

    // create a read stream from the video file
    const fileStream = fs.createReadStream(videoPath);

    // create a readable stream to stream the video file to the response
    const stream = new ReadableStream({
        async start(controller) {
            fileStream.on("data", (chunk) => {
                controller.enqueue(chunk);
            });
            fileStream.on("end", () => {
                controller.close();
            });
            fileStream.on("error", (error) => {
                controller.error(error);
            });
        },
    });

    // manually stream chunks to the response
    return new Response(stream, { headers });
}
