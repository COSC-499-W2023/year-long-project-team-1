describe("user dashboard", () => {
    beforeEach(() => {
        cy.visit("http://localhost:8081/user/dashboard");
    });

    it("passes", () => {
        cy.get("h1").should("contain", "Hi");
    });
});
