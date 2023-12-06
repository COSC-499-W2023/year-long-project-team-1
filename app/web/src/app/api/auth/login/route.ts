/*
 * Copyright [2023] [Privacypal Authors]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
