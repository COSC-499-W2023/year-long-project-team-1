/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { RESPONSE_NOT_AUTHORIZED } from "@lib/json";
import { getSession } from "@lib/session";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
        return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
    }
    return Response.json(session, { status: 200 });
}
