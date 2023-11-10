/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { clearSession, getSession } from "@lib/session";

export async function GET(req: Request) {
    const session = await getSession();

    if (session) {
        await clearSession();
    }

    const fullUrl = new URL(req.url);
    const url = `${fullUrl.protocol}//${fullUrl.host}`;

    return Response.redirect(`${url}/login`, 302);
}
