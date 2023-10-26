/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */

import { writeFile } from "fs/promises";

export async function POST(req: Request) {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return Response.json({ success: false });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = `/tmp/${file.name}`;
    try {
        await writeFile(path, buffer);
        console.log(`file uploaded to: ${path}`);
        return Response.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return Response.json({ success: false });
    }
}
