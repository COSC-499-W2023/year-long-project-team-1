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

  it("should display the user lookup/new appointment form if logged in as pro", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);
    cy.url().should("include", "/staff/appointment/new");
    cy.get("div[class=pf-v5-c-card__title-text]").contains("New Appointment");
  });

  it("should not show results if not found", () => {
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
        cy.get("input[aria-label='Search input']").type("connor");
        cy.get("button").contains("Search").click();

        // get the number of table rows after search
        cy.get("tbody").find("tr").should("have.length.lessThan", rowsBefore);
      });
  });

  it("should require an exact match for email", () => {
    cy.loginAsPro();
    cy.visit("/staff/appointment/new");
    cy.wait(250);

    // get the current number of table rows from tbody

    cy.get("button[class=pf-v5-c-menu-toggle]").click();
    cy.get("button").contains("Email").click();
    // type in the email
    cy.get("input[aria-label='Search input']").type("connor");
    cy.get("button").contains("Search").click();

    // get the number of table rows after search
    cy.get("tbody").should("not.exist");
  });
});
