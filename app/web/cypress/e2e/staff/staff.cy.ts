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
describe("Staff page rendering", () => {
    beforeEach(() => {
        cy.visit("/staff");
        cy.wait(250);
        cy.get("input[name=email]").type("johnny@example.com");
        cy.get("input[name=password]").type("password");
        cy.get("button[type=submit]").click();
        cy.wait(250);
    });

    it("Should show the staff page", () => {
        cy.get("main[aria-label='Staff-only page']");
    });

    it("Should show a sample list of users", () => {
        const usersList = cy.get("[aria-label='Example user list']");
        usersList.should("exist");
        usersList.get("h2").should("contain", "Users List");
    });
});

describe("Staff page functionality", () => {
    it("Should redirect to /login if not logged in", () => {
        cy.visit("/staff");
        cy.wait(250);
        cy.url().should("include", "/login");
    });
});
