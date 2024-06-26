# Cypress E2E and Integration Testing

_Before you being, make sure to run `npm install`, `bash ./generate_dev_env.sh`, and followed the instructions in `app/web/db/README.md`._

Many features require a user to be logged in. To test these features, you will need to add credentials to the `cypress.env.json` file. This file is not included in the repository for security reasons, so you will have to add it manually. It should be placed at the same level as `cypress.config.ts` (the project's root folder, _not_ this test folder). The file should look like this:

```json
{
  "client_username": "<client_username>",
  "client_password": "<client_password>",
  "pro_username": "<pro_username>",
  "pro_password": "<pro_password>"
}
```

Next.js will need to be running in development mode for Cypress to work:

```bash
npm run start:dev
```

## Running Cypress

Cypress tests are most easily run through a GUI. Since this is an E2E testing framework, you will also need a compatible web browser installed. Firefox or Chrome are recommended. Safari is not supported.

To open the Cypress GUI, run:

```bash
npm run cypress:open
```

This will first open Cypress, which first asks you what kind of test you want to run: E2E or Component. Due to the nature of Next.js and Server Side Rendering, we cannot run Component tests. Select E2E.

![Cypress welcome screen](./img/cypress/open_cypress.png)

Next, Cypress will ask you which browser you want to run the tests in. Select the browser you have installed. You can also use Electron, which is included with Cypress. This is not recommended due to compatibility issues and the fact that real users will not be using Electron.

![Cypress choose browser](./img/cypress/choose_browser.png)

## Writing

From the Cypress E2E dashboard, select `+ New Spec`. Yours will not say `No specs found` since this is a screenshot from a fresh install.

![Cypress new spec](./img/cypress/new_spec.png)

From here, choose `Create new spec`.

![Cypress create new spec](./img/cypress/create_new_spec.png)

Then, select the file you want to write your test in. The file name must fit the constraints as defined in [`cypress.config.ts`](../cypress.config.ts). You will not be able to proceed if you do not correctly name your specs, but Cypress will help you figure it out.

![Cypress new spec](./img/cypress/spec_name.png)

Then it will give you a preview of the spec file. Click `Okay, run the spec` to continue or `+ Create another spec` if you'd like to quickly create more.

![Cypress run spec](./img/cypress/run_spec.png)

This will create a sample spec file for you and open it in the test runner.

![Cypress example spec run](./img/cypress/example_spec_run.png)

Back in your code editor, you can find the file in the `app/web/cypress` folder (the same folder this README is in). Go ahead and write your tests following similar patterns to provided example spec and familiar Jest-like syntax.

### Headless Testing

To run all tests without the GUI, run the follwing commands:

```bash
npm run start:dev
npm run cypress:run
```

## Cypress vs. Jest

Since Next.js is a complete framework, many of its features require a running server. Unique features like Server Components, Server Actions, and API routes are dependent on a running Next.js instance. Server components, for example, are not completely standard React (yet), so Jest cannot run them. Cypress, interestingly, cannot run them either. However, Cypress E2E tests rely on a running server, so we can use Cypress to test these features. This is very useful since much of the code in this project is Next.js-specific.

When deciding on whether to use Cypress or Jest, consider the following:

- Does the test evaluate a Server Component, Server Action, or API route? (Use **Cypress**)
- Does the test evaluate multiple components and their interactions? (Use **Cypress**)
- Does the test evaluate a single, non-dependent client component? (You _can_ use Jest but it makes more sense to use **Cypress** since some components _must_ be tested there)
- Are you testing a utility function or custom support library? (Use **Jest**)

Usually we only spin up a server to perform an inregration or E2E test, but since even testing one Server Component requires a server, you can think of this as a special kind of component test.

### Coverage Testing

Coverage tests are only run with Jest. In order to run coverage tests in Cypress, we must first "instrument" our code, which allows calls to be tracked. This is not natively supported by Cypress, but there are options for manual integration. However, server-level Next.js uses some features that are not able to be instrumented, so we cannot get a coverage report for many of our React components.
