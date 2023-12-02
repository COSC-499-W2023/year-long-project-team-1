/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { RESPONSE_NOT_AUTHORIZED } from "@lib/response";
import { getSession } from "@lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
        return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
    }
    console.log("Found session:", session);
    return Response.json({ data: session }, { status: 200 });
}
