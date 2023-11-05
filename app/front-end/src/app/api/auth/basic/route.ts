/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { basicDummyAuthentication, privacyPalAuthManager } from "@lib/auth";
import { RESPONSE_NOT_AUTHORIZED, RESPONSE_OK } from "@lib/json";

export async function POST(req: Request) {
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    if (authorizationHeader) {
        const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
        if (isBasicAuthHeader && privacyPalAuthManager === "basic") {
            const authRequest = await basicDummyAuthentication(authorizationHeader);

            if (authRequest) {
                return Response.json(RESPONSE_OK, { status: 200 });
            }
        }
    }

    requestHeaders.set("WWW-Authenticate", 'Basic realm="Access to the staging site", charset="UTF-8"');
    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401, headers: requestHeaders });
}
