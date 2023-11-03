/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { headers } from "next/headers";

export async function GET(req: Request) {
    const headersList = headers();
    const authorizationHeader = headersList.get("authorization");

    console.log({ authorizationHeader });

    return Response.json({ headers: JSON.stringify(authorizationHeader) });
}
