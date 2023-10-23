/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { getServerSession } from "next-auth";
import { privacyPalAuthOptions } from "@lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await getServerSession({ req, ...privacyPalAuthOptions });

    return NextResponse.json({
        authenticated: !!session,
        session,
    });
}
