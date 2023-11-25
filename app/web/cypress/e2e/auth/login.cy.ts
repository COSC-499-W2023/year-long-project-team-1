/*
 * Created on Sat Nov 25 2023
 * Author: Connor Doman
 */
describe("Login page", () => {
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
        cy.get("button[type=submit]").should("exist");
    });
});
