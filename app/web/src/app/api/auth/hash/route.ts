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
