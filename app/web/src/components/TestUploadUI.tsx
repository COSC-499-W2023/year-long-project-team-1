/*
 * Created on Thu Oct 26 2023
 * Author: Connor Doman
 */
"use client";

import { JSONResponse } from "@lib/response";
import { useState } from "react";

export const TestUploadUI = () => {
    const [file, setFile] = useState<File>();
    const [responseData, setResponseData] = useState<JSONResponse>();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setResponseData(undefined);

        try {
            const formData = new FormData();
            formData.set("file", file);

            const res = await fetch("/api/video/upload", {
                method: "POST",
                body: formData,
            });

            const json = await res.clone().json();

            if (!res.ok) {
                console.error("Error in upload resposne");
                throw Error(await res.text());
            }

            setResponseData(json);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])} />
                <input type="submit" value="Upload" />
            </form>
            {responseData ? <pre>{JSON.stringify(responseData, null, 2)}</pre> : null}
        </>
    );
};

export default TestUploadUI;
