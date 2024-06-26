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

describe("/api/users: Fetch users", () => {
  it("Should return a list of users", () => {
    cy.request("/api/users").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("result");
      expect(Array.isArray(response.body.result.data)).to.be.true;
      expect(response.body.result.data.length).to.be.at.least(0);
    });
  });
});
