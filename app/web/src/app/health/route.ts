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
import build from "@public/build.json";
import db from "@lib/db";
import { JSONResponse } from "@lib/response";
import { testS3Connection } from "@lib/s3";
import { testLambdaAvailability } from "@lib/lambda";

export const dynamic = "force-dynamic";

/* Database */

async function checkPostgres(): Promise<boolean> {
  try {
    await db.$connect();
    return true;
  } catch (err: any) {
    return false;
  }
}

/* S3 */

async function checkS3(): Promise<boolean> {
  return await testS3Connection();
}

/* Lambda/Video processing */

async function checkLambda(): Promise<boolean> {
  return await testLambdaAvailability();
}

/* Route handlers */

export async function GET() {
  const databaseAlive = await checkPostgres();
  const s3Alive = await checkS3();
  const lambdaAlive = await checkLambda();

  const response: JSONResponse = {
    data: {
      app_version: build.version,
      video_processor_available: lambdaAlive,
      database_available: databaseAlive,
      video_storage_available: s3Alive,
    },
  };
  return Response.json(response);
}
