/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import { JSONResponse } from "@lib/response";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(text, salt);
    const res: JSONResponse = {
        data: {
            hash,
        },
    };
    return Response.json(res);
}
