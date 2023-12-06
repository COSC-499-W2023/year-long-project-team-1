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

import { base64ToUtf8, utf8ToBase64 } from "@lib/base64";

describe("base64ToUtf8", () => {
    it("should convert base64 to utf8", () => {
        const base64 = "SGVsbG8gV29ybGQ=";
        const utf8 = "Hello World";
        expect(base64ToUtf8(base64)).toBe(utf8);
    });
});

describe("utf8ToBase64", () => {
    it("should convert utf8 to base64", () => {
        const base64 = "SGVsbG8gV29ybGQ=";
        const utf8 = "Hello World";
        expect(utf8ToBase64(utf8)).toBe(base64);
    });
});
