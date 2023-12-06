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
