/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { basicAuthentication, privacyPalAuthManagerType } from "@lib/auth";
import { JSONResponse, RESPONSE_NOT_AUTHORIZED, RESPONSE_NOT_IMPLEMENTED } from "@lib/response";
import { setSession } from "@lib/session";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    console.log("POST /api/auth/login");
    console.log("POST /api/auth/login");
    const requestHeaders = new Headers(req.headers);
    const authorizationHeader = requestHeaders.get("authorization");

    if (authorizationHeader) {
        switch (privacyPalAuthManagerType) {
            case "basic":
                const isBasicAuthHeader = authorizationHeader.startsWith("Basic ");
                if (isBasicAuthHeader && privacyPalAuthManagerType === "basic") {
                    const authorizedUser = await basicAuthentication(authorizationHeader);

                    if (authorizedUser) {
                        // set session cookie on successful auth
                        authorizedUser.isLoggedIn = true;
                        await setSession(authorizedUser);

                        revalidatePath("/", "layout");

                        const response: JSONResponse = { data: { user: authorizedUser } };
                        return Response.json(response, { status: 200 });
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
