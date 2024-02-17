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
const {
  createDbInitializer,
  createNetwork,
  createDb,
  createDbInitializerWithMissingEnvVars,
  SUCCESS_MESSAGE,
  SKIPPED_MESSAGE,
  createDbInitializerWithWrongHost,
  createDbInitializerWithWrongPort,
  createDbInitializerWithInvalidCreds,
  validateGeneratedSchema,
} = require("./utils");
const { Client } = require("pg");
const { Wait } = require("testcontainers");

jest.setTimeout(120000);

const runInitialzer = async (delegate, network, message, timeout = 1000) => {
  return await delegate(network)
    .withWaitStrategy(Wait.forLogMessage(message).withStartupTimeout(timeout))
    .start()
    .then((_) => undefined)
    .catch((err) => err);
};

describe("Prisma Schema", () => {
  let network;

  beforeAll(async () => {
    network = await createNetwork();
  });

  afterAll(async () => {
    network.stop();
  });

  describe("when generated", () => {
    let pgContainer;
    let client;

    beforeEach(async () => {
      // Start containers
      pgContainer = await createDb(network).start();

      // Initialize the client connection
      client = new Client({ connectionString: pgContainer.getConnectionUri() });
      await client.connect();
    });

    afterEach(async () => {
      await client.end();
      await pgContainer.stop();
    });

    describe("with valid environment variables", () => {
      it("should create correct tables", async () => {
        let err = await runInitialzer(
          createDbInitializer,
          network,
          SUCCESS_MESSAGE,
          2000,
        );

        expect(err).toBeFalsy();

        err = await validateGeneratedSchema(client);
        expect(err).toBeFalsy();
      });

      it("should skip generating if schema has not changed", async () => {
        let err = await runInitialzer(
          createDbInitializer,
          network,
          SUCCESS_MESSAGE,
          2000,
        );

        expect(err).toBeFalsy();

        err = await validateGeneratedSchema(client);
        expect(err).toBeFalsy();

        err = await runInitialzer(
          createDbInitializer,
          network,
          SKIPPED_MESSAGE,
          1000,
        );
        expect(err).toBeFalsy();
      });
    });

    describe("with missing environment variables", () => {
      it("should fail", async () => {
        const err = await runInitialzer(
          createDbInitializerWithMissingEnvVars,
          network,
          SUCCESS_MESSAGE,
        );
        expect(err).toBeTruthy();
      });
    });

    describe("with wrong host", () => {
      it("should fail", async () => {
        const err = await runInitialzer(
          createDbInitializerWithWrongHost,
          network,
          SUCCESS_MESSAGE,
        );
        expect(err).toBeTruthy();
      });
    });

    describe("with wrong port", () => {
      it("should fail", async () => {
        const err = await runInitialzer(
          createDbInitializerWithWrongPort,
          network,
          SUCCESS_MESSAGE,
        );
        expect(err).toBeTruthy();
      });
    });

    describe("with invalid credentials", () => {
      it("should fail", async () => {
        const err = await runInitialzer(
          createDbInitializerWithInvalidCreds,
          network,
          SUCCESS_MESSAGE,
        );
        expect(err).toBeTruthy();
      });
    });
  });
});
