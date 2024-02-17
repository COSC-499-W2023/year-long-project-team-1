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
const { GenericContainer, Network, Wait } = require("testcontainers");
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { isEqual } = require("lodash");

// Database configurations
const DB_STARTUP_TIMEOUT = 60000; // ms
const DB_CONTAINER_HOST = "db";
const DB_NAME = "privacypal-itest";
const DB_USERNAME = "admin";
const DB_PASSWORD = "password";

// Container configurations
const DATABASE_IMAGE =
  process.env.DATABASE_IMAGE || "docker.io/library/postgres:16-bullseye";

const IMAGE_VERSION = process.env.IMAGE_VERSION || "0.1.0-dev";
const IMAGE_NAME = process.env.IMAGE_NAME || "privacypal-init-db";
const IMAGE_NAMESPACE = process.env.IMAGE_NAMESPACE || "ghcr.io/cosc-499-w2023";
const DB_INIT_IMAGE = `${IMAGE_NAMESPACE}/${IMAGE_NAME}:${IMAGE_VERSION}`;

const SUCCESS_MESSAGE = "All migrations have been successfully applied.";
const SKIPPED_MESSAGE = "No pending migrations to apply.";

// Create a network to put the database and initializer in
const createNetwork = async () => await new Network().start();

// Create database (postgres) container
const createDb = (network) =>
  new PostgreSqlContainer(DATABASE_IMAGE)
    .withNetwork(network)
    .withNetworkAliases(DB_CONTAINER_HOST)
    .withHealthCheck({
      test: [
        "CMD-SHELL",
        `pg_isready -U ${DB_USERNAME} -d ${DB_NAME} || exit 1`,
      ],
      interval: 2000, // ms
      timeout: DB_STARTUP_TIMEOUT,
      startPeriod: 1000,
      retries: 5,
    })
    .withWaitStrategy(Wait.forHealthCheck())
    .withDatabase(DB_NAME)
    .withUsername(DB_USERNAME)
    .withPassword(DB_PASSWORD);

// Create initialzer container
const _createDbInitializer = (network, envs) =>
  new GenericContainer(DB_INIT_IMAGE)
    .withNetwork(network)
    .withEnvironment(envs);

const _baseEnv = {
  PRIVACYPAL_POSTGRES_USERNAME: DB_USERNAME,
  PRIVACYPAL_POSTGRES_PASSWORD: DB_PASSWORD,
  PRIVACYPAL_POSTGRES_HOST: DB_CONTAINER_HOST,
  PRIVACYPAL_POSTGRES_PORT: 5432,
  PRIVACYPAL_POSTGRES_DATABASE: DB_NAME,
};

const createDbInitializer = (network) =>
  _createDbInitializer(network, _baseEnv);

const createDbInitializerWithMissingEnvVars = (network) =>
  _createDbInitializer(network, {});

const createDbInitializerWithWrongHost = (network) =>
  _createDbInitializer(network, {
    ..._baseEnv,
    PRIVACYPAL_POSTGRES_HOST: "unknown-host",
  });

const createDbInitializerWithWrongPort = (network) =>
  _createDbInitializer(network, {
    ..._baseEnv,
    PRIVACYPAL_POSTGRES_PORT: 8000,
  });

const createDbInitializerWithInvalidCreds = (network) =>
  _createDbInitializer(network, {
    ..._baseEnv,
    PRIVACYPAL_POSTGRES_USERNAME: "unknown-user",
    PRIVACYPAL_POSTGRES_PASSWORD: "not-password",
  });

const APPOINTMENT_TABLE = {
  name: "Appointment",
  fields: [
    {
      column_name: "id",
      data_type: "integer",
      character_maximum_length: null,
      column_default: `nextval('"Appointment_id_seq"'::regclass)`,
      is_nullable: "NO",
    },
    {
      column_name: "time",
      data_type: "timestamp without time zone",
      character_maximum_length: null,
      column_default: "CURRENT_TIMESTAMP",
      is_nullable: "NO",
    },
    {
      column_name: "proUsrName",
      data_type: "text",
      character_maximum_length: null,
      column_default: null,
      is_nullable: "NO",
    },
    {
      column_name: "clientUsrName",
      data_type: "text",
      character_maximum_length: null,
      column_default: null,
      is_nullable: "NO",
    },
  ],
};
const VIDEO_TABLE = {
  name: "Video",
  fields: [
    {
      column_name: "apptId",
      data_type: "integer",
      character_maximum_length: null,
      column_default: null,
      is_nullable: "NO",
    },
    {
      column_name: "awsRef",
      data_type: "text",
      character_maximum_length: null,
      column_default: null,
      is_nullable: "NO",
    },
  ],
};

const tableQuery = (table) => {
  return `select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = '${table}';`;
};

const validateTable = async (client, table) => {
  // Validate
  let query = tableQuery(table.name);

  let result = await client.query(query);

  if (!result || !result.rows || !result.rows.length) {
    return new Error(
      `Information query for table ${table.name} returns empty.`,
    );
  }

  const fields = result.rows;
  if (!isEqual(fields, table.fields)) {
    return new Error(`Generated table ${table.name} is invalid.`);
  }

  return undefined;
};

const validateGeneratedSchema = async (client) => {
  let err = await validateTable(client, APPOINTMENT_TABLE);
  if (err) {
    return err;
  }
  return await validateTable(client, VIDEO_TABLE);
};

module.exports = {
  DB_STARTUP_TIMEOUT,
  DB_CONTAINER_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DATABASE_IMAGE,
  IMAGE_VERSION,
  IMAGE_NAME,
  IMAGE_NAMESPACE,
  DB_INIT_IMAGE,
  SUCCESS_MESSAGE,
  SKIPPED_MESSAGE,
  APPOINTMENT_TABLE,
  VIDEO_TABLE,
  createNetwork,
  createDb,
  createDbInitializer,
  createDbInitializerWithMissingEnvVars,
  createDbInitializerWithWrongHost,
  createDbInitializerWithWrongPort,
  createDbInitializerWithInvalidCreds,
  validateGeneratedSchema,
  validateTable,
};
