describe("User profile functionality", () => {
  const username = Cypress.env("client_username");

  beforeEach(() => {
    cy.loginAsClient();
    cy.visit(`/profile`);
    cy.wait(500);
  });

  it("should show the user's username", () => {
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", username);
  });

  it("should show the user's email", () => {
    // use regex to check if there is an email address
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", "@");
  });

  it("should show the user's role", () => {
    cy.get("div.pf-v5-l-flex").get("span").should("contain.text", "Client");
  });

  it("should have a link to edit password", () => {
    cy.get("a").should("contain.text", "Edit your password");
  });
});
