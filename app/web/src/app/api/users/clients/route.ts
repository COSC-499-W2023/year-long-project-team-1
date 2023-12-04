/*
 * Created on Thu Nov 30 2023
 * Author: Connor Doman
 */

import { getClients } from "@app/actions";
import { JSONResponse, RESPONSE_NOT_FOUND } from "@lib/response";

export async function GET(req: Request) {
    const clients = await getClients();

    if (clients && clients.length > 0) {
        const res: JSONResponse = {
            data: clients,
        };
        return Response.json(res, { status: 200 });
    }

    return Response.json(RESPONSE_NOT_FOUND, { status: 404 });
}
