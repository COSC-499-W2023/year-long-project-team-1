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

describe("Staff new appointment form functionality", () => {
  afterEach(() => {
    // easiest way to clear filters without needing to check every page for the existence of that button
    cy.wait(250);
    cy.visit("/");
  });

  it("should redirect to /login if not logged in", () => {
    cy.visit("/staff/appointment");
    cy.wait(250);
    cy.url().should("include", "/login");
  });

  it("should lead the user to lookup/new appointment form if logged in as pro", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);
    cy.url().should("include", "/staff/appointment/new");
    cy.get("div[class=pf-v5-c-card__title-text]").contains("New Appointment");
  });

  it("should not show results table if not found", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);
    cy.url().should("include", "/staff/appointment/new");
    cy.get("input[aria-label='Search input']").type("fake_user");
    cy.get("button").contains("Search").click();

    cy.get("table[aria-label='Table of object data']").should("not.exist");
  });

  it("should be able to do a partial lookup by username", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);

    // get the current number of table rows from tbody
    cy.get("tbody")
      .find("tr")
      .then((rows) => {
        const rowsBefore = rows.length;

        // type in the username
        const username = Cypress.env("client_username");
        // use half the username as a partial
        cy.get("input[aria-label='Search input']").type(
          username.slice(0, username.length / 2),
        );
        cy.get("button").contains("Search").click();

        // get the number of table rows after search
        cy.get("tbody").find("tr").should("have.length.lessThan", rowsBefore);
      });
  });

  it("should be able to do an exact lookup by username", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);
    // type in the username
    cy.get("input[aria-label='Search input']")
      .clear()
      .type(Cypress.env("client_username")); // if this is valid for login it will exist in the table
    cy.get("button").contains("Search").click();

    // get the number of table rows after search
    cy.get("tbody").find("tr").should("have.length", 1);
  });

  it("should be able to do a partial lookup by email", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);

    // get the current number of table rows from tbody
    cy.get("tbody")
      .find("tr")
      .then((rows) => {
        const rowsBefore = rows.length;

        // click to select email
        cy.get("button.pf-v5-c-menu-toggle").click();
        cy.get("button.pf-v5-c-menu__item").contains("Email").click();

        // type in the username
        cy.get("input[aria-label='Search input']").type("connor");
        cy.get("button").contains("Search").click();

        // get the number of table rows after search
        cy.get("tbody").find("tr").should("have.length.lessThan", rowsBefore);
      });
  });

  it("should be able to do an exact lookup by email", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);

    // click to select email
    cy.get("button.pf-v5-c-menu-toggle").click();
    cy.get("button.pf-v5-c-menu__item").contains("Email").click();

    // type in the username
    cy.get("input[aria-label='Search input']").type("connor@connordoman.dev");
    cy.get("button").contains("Search").click();

    // get the number of table rows after search
    cy.get("tbody").find("tr").should("have.length", 1);
  });
});
