describe("User appointments functionality", () => {
  it("should redirect to /login if not logged in", () => {
    cy.visit("/user/appointments");
    cy.wait(250);
    cy.url().should("include", "/login");
  });

  it("should display the user appointments if logged in", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointments");
    cy.wait(250);
    cy.url().should("include", "/staff/appointments");
  });
});
