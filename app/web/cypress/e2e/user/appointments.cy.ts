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
describe("User appointments functionality", () => {
  it("should redirect to /login if not logged in", () => {
    cy.visit("/user/appointments");
    cy.wait(250);
    cy.url().should("include", "/login");
  });

  it("should display the user appointments if logged in", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointments");
    cy.wait(250);
    cy.url().should("include", "/staff/appointments");
  });
});
