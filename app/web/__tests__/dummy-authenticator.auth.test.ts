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

import { utf8ToBase64 } from "@lib/base64";
import { DummyBasicAuthenticator } from "@lib/dummy-authenticator";

describe("Dummy Authenticator", () => {
  it("works for valid credentials", async () => {
    const dummyAuthenticator = new DummyBasicAuthenticator();
    const credentials = { email: "johnny@example.com", password: "password" };
    const user = await dummyAuthenticator.authorize(credentials);
    expect(user).toEqual({
      id: "1",
      email: "johnny@example.com",
    });
  });

  it("fails for invalid credentials", async () => {
    const dummyAuthenticator = new DummyBasicAuthenticator();
    const credentials = {
      email: "johnny@example.com",
      password: "wrongpassword",
    };
    const user = await dummyAuthenticator.authorize(credentials);
    expect(user).toEqual(null);
  });

  it("authentication fails if hashedPassword is empty", async () => {
    const dummyAuthenticator = new DummyBasicAuthenticator();
    const credentials = {
      email: "badatpasswords@example.com",
      password: "password",
    };
    const user = await dummyAuthenticator.authorize(credentials);
    expect(user).toEqual(null);
  });

  it("authentication fails if empty password is provided", async () => {
    const dummyAuthenticator = new DummyBasicAuthenticator();
    const credentials = { email: "johnny@example.com", password: "" };
    const user = await dummyAuthenticator.authorize(credentials);
    expect(user).toEqual(null);
  });
});
