/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      loginAsClient: () => void;
      loginAsPro: () => void;
      loginAsUser: (username: string, password: string) => void;
    }
  }
}

Cypress.Commands.add("loginAsUser", (username: string, password: string) => {
  cy.log(`Logging in as ${username}`);

  cy.session(
    { username },
    () => {
      cy.visit("/login");
      cy.wait(1000);
      cy.get("input[name=username]").type(username);
      cy.get("input[name=password]").type(password);
      cy.get("button[type=submit]").click();
      cy.wait(1000);
      cy.location("pathname").should("eq", "/");
    },
    {
      validate: () => {
        cy.getCookie("next-auth.session-token").should("exist");
        cy.request("/api/auth/session").then((response: any) => {
          console.log(response);
          expect(response.body.user?.username).to.eq(username);
        });
      },
    },
  );
});

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
  cy.loginAsUser(testUser.username, testUser.password);
});

Cypress.Commands.add("loginAsPro", () => {
  const testUser = {
    username: Cypress.env("pro_username") ?? "",
    password: Cypress.env("pro_password") ?? "",
  };

  if (!testUser.username || !testUser.password) {
    throw new Error(
      `Username or password is missing from the environment variables:\n${JSON.stringify(testUser, null, 2)}`,
    );
  }

  cy.log("Logging in as PRO");

  cy.loginAsUser(testUser.username, testUser.password);
});

export {};
