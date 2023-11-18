/*
 * Created on Thu Nov 09 2023
 * Author: Connor Doman
 */

import { clearSession } from "@lib/session";
import { redirUrlFromReq } from "@lib/url";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    await clearSession();
    revalidateTag("user");
    return Response.redirect(redirUrlFromReq(req, "/"), 302);
}
