/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { clearSession } from "@lib/session";
import { redirUrlFromReq } from "@lib/url";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    await clearSession();
    return Response.redirect(redirUrlFromReq(req, "/"), 302);
}
