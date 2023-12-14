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

import { timeStampUTC } from "@lib/time";

describe("timeStampUTC", () => {
  it("should return a string in the form <YYYYMMDD>T<HHmmss>", () => {
    const result = timeStampUTC();
    const regex = /^\d{8}T\d{6}$/;
    expect(regex.test(result)).toBe(true);
  });

  it("should return the current time in UTC", () => {
    const control = new Date("2023-10-26T00:00:00.000Z");
    const result = timeStampUTC(control);
    const controlUTC = "20231026T000000";
    expect(result).toBe(controlUTC);
  });
});
