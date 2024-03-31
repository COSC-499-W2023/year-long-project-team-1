declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      loginAsClient: () => void;
    }
  }
}

Cypress.Commands.add("loginAsClient", () => {
  const testUser = {
    username: Cypress.env("client_username") ?? "",
    password: Cypress.env("client_password") ?? "",
  };

  if (!testUser.username || !testUser.password) {
    throw new Error(
      `Username or password is missing from the environment variables:\n${JSON.stringify(testUser, null, 2)}`,
    );
  }

  cy.log("Logging in as CLIENT");

  cy.session(
    testUser,
    () => {
      cy.visit("/login");
      cy.wait(1000);
      cy.get("input[name=username]").type(testUser.username);
      cy.get("input[name=password]").type(testUser.password);
      cy.get("button[type=submit]").click();
      cy.wait(1000);
      cy.location("pathname").should("eq", "/");
    },
    {
      validate: () => {
        cy.getCookie("next-auth.session-token").should("exist");
      },
    },
  );
});

export {};
