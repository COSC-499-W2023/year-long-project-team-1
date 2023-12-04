import { NextRequest, NextResponse } from "next/server";

const videoServerUrl = process.env.PRIVACYPAL_PROCESSOR_URL || "localhost:3000";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const filename = searchParams.get("filename");

    if (!filename) {
        return NextResponse.json({ message: "Filename is not provided." }, { status: 400 });
    }

    const url = new URL("/process_status", videoServerUrl);
    url.searchParams.append("filename", filename);
    const videoServerRes = await fetch(url);
    const text = await videoServerRes.text();
    return NextResponse.json({ message: text }, { status: videoServerRes.status });
}
