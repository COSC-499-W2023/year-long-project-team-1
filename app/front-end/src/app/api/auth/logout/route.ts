/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { clearSession, getSession } from "@lib/session";
import { redirUrlFromReq } from "@lib/url";

export async function GET(req: Request) {
    const session = await getSession();

    if (session) {
        await clearSession();
    }

    return Response.redirect(redirUrlFromReq(req, "/"), 302);
}
