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