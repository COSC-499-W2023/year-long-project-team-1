Cypress.Commands.add("loginAsTest", () => {
  const username = Cypress.env("PRIVACYPAL_TEST_USERNAME_BASIC");
  const password = Cypress.env("PRIVACYPAL_TEST_PASSWORD_BASIC");
  const loginUrl = Cypress.env("PRIVACYPAL_TEST_SITE_URL");
  const cookieName = Cypress.env("PRIVACYPAL_AUTH_COOKIE_NAME");

  cy.request("/api/auth/signin", {
    method: "POST",
    body: {
      username,
      password,
    },
  }).then((response) => {
    cy.clearCookies();

    const cookies = response.headers["set-cookie"];
  });
});
