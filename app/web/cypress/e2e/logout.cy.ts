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
describe("Logout page", () => {
    beforeEach(() => {});

    it("should redirect a logged out user to login", () => {
        cy.visit("/logout");
        cy.wait(250);
        cy.url().should("include", "/login");
    });

    it("should clear a user session", () => {
        cy.visit("/login");
        cy.get("input[name=email]").type("johnny@example.com");
        cy.get("input[name=password]").type("password");
        cy.get("button[type=submit]").click();
        cy.wait(250);
        cy.url().should("match", /\/$/);
        cy.visit("/logout");
        cy.wait(250);
        cy.visit("/user/dashboard");
        cy.wait(500);
        cy.url().should("include", "/login");
    });
});
