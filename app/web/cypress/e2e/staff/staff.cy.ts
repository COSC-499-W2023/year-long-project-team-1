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
