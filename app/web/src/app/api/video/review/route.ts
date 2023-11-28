import path from 'path';
import fs from 'fs/promises';
import db from "@lib/db";
import { JSONErrorBuilder, JSONResponseBuilder, RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { getSession } from "@lib/session";
import { generateObjectKey, uploadArtifact } from '@lib/s3';

enum ReviewAction {
    ACCEPT = "accept",
    REJECT = "reject",
    /**
     * TODO: Periodically prune input and processed videos.
     * Stale videos on servers post a data security concern.
     */
    NOOP = "noop"
}

interface RequestBody {
    apptId: string;
    filename: string;
    action: ReviewAction;
}

function isActionValid(action: string): boolean {
    return Object.values<string>(ReviewAction).includes(action.toLowerCase());
}

function validateBody({ apptId, filename, action }: RequestBody) {
    if (apptId && !Number.isNaN(apptId) && filename && isActionValid(action)) {
        return;
    }
    // FIXME: Error message should be reformatted with consitent styles.
    const message = !apptId? "Appointment ID is rquired. Missing.":
                    Number.isNaN(apptId)? "Invalid appointment ID.":
                    !filename? "Filename is required. Missing.":
                    !action? "Action is required. Mssing.":
                    !isActionValid(action)? "Invalid action": "Unknown error";
    const error = JSONErrorBuilder.from(400, "Invalid request body", message);
    return Response.json(
        JSONResponseBuilder.from(400, error),
        { status: 400 }
    );
}

function getProcessedFilePath(srcFilename: string) {
    const extension = path.extname(srcFilename);
    const basename = path.basename(srcFilename, extension);
    const outputDir = process.env.PRIVACYPAL_OUTPUT_VIDEO_DIR || "/opt/privacypal/output_videos";
    return path.join(outputDir, `${basename}-processed${extension}`);
}

function getSrcFilePath(srcFilename: string) {
    const inputDir = process.env.PRIVACYPAL_INPUT_VIDEO_DIR || "/opt/privacypal/input_videos";
    return path.join(inputDir, srcFilename);
}

/**
 * 
 * Endpoint: /api/video/review
 * Request body: 
 * {
 *  "apptId": "<apptId>",
 *  "filename": "<filename>",
 *  "action": "accept/reject/noop"
 * }
 */
export async function POST(req: Request) {
    const body: RequestBody = await req.json();

    validateBody(body);

    const { apptId, filename: srcFilename, action }  = body;

    const user = await getSession();

    // FIXME: Check if the authenticated user is authorized to perform this action.
    if (!user || !user.isLoggedIn) {
        return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
    }

    // Check if the appointment exists
    const appointment = await db.appointment.findUnique({
        where: {
            id: Number(apptId),
            clientId: Number(user.id)
        }
    });
    if (!appointment) {
        return Response.json(
            JSONResponseBuilder.from(400, JSONErrorBuilder.from(400, "Invalid Appointment ID or UID"))
        );
    }

    const srcFilePath = getSrcFilePath(srcFilename);
    const toUploadPath = getProcessedFilePath(srcFilename);

    // Check if the file exists
    const stat = await fs.stat(toUploadPath);
    if (!stat.isFile()) {
        return Response.json(
            JSONResponseBuilder.from(404, JSONErrorBuilder.from(404, "File does not exist", `${srcFilename} does not exist or is not yet processed.`)), 
            { status: 404 });
    }


    const cleanup = async () => {
        await fs.unlink(toUploadPath);
        await fs.unlink(srcFilePath);
    };

    try {
        switch (action) {
            case ReviewAction.NOOP:
                break;
            case ReviewAction.REJECT:
                await cleanup();
                break;
            case ReviewAction.ACCEPT:
                await uploadArtifact({
                    key: generateObjectKey(srcFilename, `${user.id}`),
                    metadata: {
                        "apptId": apptId
                    },
                    path: toUploadPath,
                });
                await cleanup();
                break;
            default:
        }
        return Response.json(
            JSONResponseBuilder.instance().build(),
            { status: 200 }
        );
    } catch(e: any) {
        return Response.json(
            JSONResponseBuilder.from(500, JSONErrorBuilder.from(500, "Unable to process request", e.message || e)), 
            { status: 500 });
    }

}

