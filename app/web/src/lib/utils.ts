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
        if (e.code === "ENOEN") {
            return false;
        }
        throw e;
    }
}
