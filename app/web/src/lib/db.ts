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
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const userName = process.env.PRIVACYPAL_POSTGRES_USERNAME;
  const host = process.env.PRIVACYPAL_POSTGRES_HOST;
  const port = process.env.PRIVACYPAL_POSTGRES_PORT;
  const database = process.env.PRIVACYPAL_POSTGRES_DATABASE;
  const password = process.env.PRIVACYPAL_POSTGRES_PASSWORD;

  return new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${userName}:${password}@${host}:${port}/${database}`,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;
