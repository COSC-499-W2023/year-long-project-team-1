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
import type { PathLike } from 'fs';
import path from 'path';
import fs from 'fs/promises';

export function getProcessedFilePath(srcFilename: string) {
    const extension = path.extname(srcFilename);
    const basename = path.basename(srcFilename, extension);
    const outputDir = process.env.PRIVACYPAL_OUTPUT_VIDEO_DIR || "/opt/privacypal/output_videos";
    return path.join(outputDir, `${basename}-processed${extension}`);
}

export function getSrcFilePath(srcFilename: string) {
    const inputDir = process.env.PRIVACYPAL_INPUT_VIDEO_DIR || "/opt/privacypal/input_videos";
    return path.join(inputDir, srcFilename);
}

export async function checkFileExist(path: PathLike) {
    try {
        const stat = await fs.stat(path);
        return stat.isFile();
    } catch (e: any) {
        if (e.code === "ENOENT") {
            return false;
        }
        throw e;
    }
}

export function isInt(str: string) {
    return /^\d+$/.test(str);
}
