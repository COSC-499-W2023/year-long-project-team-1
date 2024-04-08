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
