/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */
"use client";

import { useState } from "react";

export const TestUploadUI = () => {
    const [file, setFile] = useState<File>();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            const data = new FormData();
            data.set("file", file);

            const res = await fetch("/api/video/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) {
                console.error("Error in upload resposne");
                throw Error(await res.text());
            }
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
            <input type="submit" value="Upload" />
        </form>
    );
};

export default TestUploadUI;
