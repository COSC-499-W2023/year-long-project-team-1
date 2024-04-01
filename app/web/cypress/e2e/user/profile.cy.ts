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
describe("User profile functionality", () => {
  const username = Cypress.env("client_username");

  beforeEach(() => {
    cy.loginAsClient();
    cy.visit(`/profile`);
    cy.wait(500);
  });

  it("should show the user's username", () => {
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", username);
  });

  it("should show the user's email", () => {
    // use regex to check if there is an email address
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", "@");
  });

  it("should show the user's role", () => {
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", "Client");
  });

  it("should have a link to edit password", () => {
    cy.get("a").should("contain.text", "Edit your password");
  });
});
