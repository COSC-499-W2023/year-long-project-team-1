describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the home page", () => {
    cy.get("h1").contains("PRIVACYPAL");
  });

  it("should contain a sign in button", () => {
    const signInButton = cy.get("a[href='#signin']");
    signInButton.should("exist");
    signInButton.should("contain", "Sign in");
  });

  it("should contain a sign up button", () => {
    const signUpButton = cy.get("a[href='/signup']");
    signUpButton.should("exist");
    signUpButton.should("contain", "Sign up");
  });

  it("should contain a link to GitHub", () => {
    cy.get("a[href^='https://github.com']").should("exist");
  });
});
