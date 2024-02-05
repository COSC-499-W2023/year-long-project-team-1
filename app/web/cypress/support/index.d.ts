declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user.
     * @example cy.login('username', 'password')
     */
    loginAsTest(): Chainable<void>;
  }
}
