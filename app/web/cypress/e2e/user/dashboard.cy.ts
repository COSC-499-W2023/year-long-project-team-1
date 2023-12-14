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
describe("User dashboard functionality", () => {
  it("should redirect to /login if not logged in", () => {
    cy.visit("/user/dashboard");
    cy.wait(250);
    cy.url().should("include", "/login");
  });

  it("should display the user dashboard if logged in", () => {
    cy.visit("/user/dashboard");
    cy.wait(250);
    cy.url().should("include", "/login");
    cy.get("input[name=email]").type("johnny@example.com");
    cy.get("input[name=password]").type("password");
    cy.get("button[type=submit]").click();
    cy.wait(250);
    cy.url().should("include", "/user/dashboard");
  });
});

describe("User dashboard rendering", () => {
  beforeEach(() => {
    cy.visit("/user/dashboard");
    cy.wait(250);
    cy.url().should("include", "/login");
    cy.get("input[name=email]").type("johnny@example.com");
    cy.get("input[name=password]").type("password");
    cy.get("button[type=submit]").click();
    cy.wait(250);
    cy.url().should("include", "/user/dashboard");
  });

  it("should display the user dashboard", () => {
    cy.get("h1").contains("Hi,");
    cy.get("div[aria-label='User Dashboard']").should("exist");
  });

  it("should have an appointments section", () => {
    cy.get("h2").contains("Upcoming Appointments");
    cy.get("div[aria-label='Upcoming Appointments']").should("exist");
  });

  it("should have a user card", () => {
    cy.get("div[aria-label='Your Personal Information']").should("exist");
  });

  it("should have a recent messages section", () => {
    cy.get("h2").contains("Recent Messages");
    cy.get("div[aria-label='Recent Messages']").should("exist");
  });
});
