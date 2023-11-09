/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { basicAuthentication, privacyPalAuthManagerType } from "@lib/auth";
import { RESPONSE_NOT_AUTHORIZED, RESPONSE_NOT_IMPLEMENTED, RESPONSE_OK } from "@lib/json";
import { setSession } from "@lib/session";

export async function POST(req: Request) {
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    if (authorizationHeader) {
        switch (privacyPalAuthManagerType) {
            case "basic":
                const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
                if (isBasicAuthHeader && privacyPalAuthManagerType === "basic") {
                    const authRequest = await basicAuthentication(authorizationHeader);

                    if (authRequest) {
                        // set session cookie on successful auth
                        await setSession(authRequest);

                        return Response.json(RESPONSE_OK, { status: 200 });
                    }
                }
                requestHeaders.set("WWW-Authenticate", 'Basic realm="Access to protected pages", charset="UTF-8"');
                return Response.json(RESPONSE_NOT_AUTHORIZED, { status: 401, headers: requestHeaders });
            case "aws_cognito":
            default:
                return Response.json(RESPONSE_NOT_IMPLEMENTED, { status: 501 });
        }
    }
}
