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

describe("Login page rendering", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should display the login page", () => {
    cy.visit("/login");
    cy.get("h1").contains("Log in");
  });

  it("should contain an email field", () => {
    cy.get("input[name=email]").should("exist");
  });

  it("should contain a password field", () => {
    cy.get("input[name=password]").should("exist");
  });

  it("should contain a submit button", () => {
    const signInButton = cy.get("button[type=submit]");
    signInButton.should("exist");
    signInButton.should("contain", "Submit");
  });

  it("should include a disabled sign up with code button", () => {
    const disabledButton = cy.get("button[type=button]");
    disabledButton.should("exist");
    disabledButton.should("contain", "Sign up with Code");
    disabledButton.should("be.disabled");
  });
});

describe("Login page functionality", () => {
  it("should not redirect on login failure", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("nobody@example.com");
    cy.get("input[name=password]").type("password");
    cy.get("button[type=submit]").click();
    cy.wait(1000);
    cy.url().should("include", "/login");
  });

  it("should redirect to / on login success", () => {
    cy.visit("/login");
    cy.get("input[name=email]").type("johnny@example.com");
    cy.get("input[name=password]").type("password");
    cy.get("button[type=submit]").click();
    cy.wait(1000);
    cy.url().should("match", /\/$/);
  });

  it("should redirect to provided redirect url on login success", () => {
    cy.visit("/login?r=%2Fuser");
    cy.get("input[name=email]").type("johnny@example.com");
    cy.get("input[name=password]").type("password");
    cy.get("button[type=submit]").click();
    cy.wait(1000);
    cy.url().should("match", /\/user$/);
  });
});
