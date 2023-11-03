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
            console.log("Basic auth header detected");

            const authRequest = await basicDummyAuthentication(authorizationHeader);

            console.log({ authRequest });

            if (authRequest) {
                console.log("Authorization header, authorized");

                return Response.json(RESPONSE_OK, { status: 200 });
            }
        }

        console.log("Authorization header, not authorized");
        requestHeaders.set("WWW-Authenticate", 'Basic realm="Access to the staging site", charset="UTF-8"');
        return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401, headers: requestHeaders });
    }

    return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401 });
}
