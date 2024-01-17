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
import { PRIVACYPAL_VERSION } from "@lib/config";
import prisma from "@lib/db";
import { JSONResponse } from "@lib/response";
import { client, testS3Connection } from "@lib/s3";

/* Video processing */

// TODO: update this env var to use Lambda when implemented
const videoServerUrl = process.env.PRIVACYPAL_PROCESSOR_URL || "";

async function checkVideoProcessor(): Promise<boolean> {
  const healthEndpoint = new URL("/health", videoServerUrl);
  try {
    const response = await fetch(healthEndpoint.toString());
    const statusCode = response.status;
    return statusCode === 200 || statusCode === 204;
  } catch (err: any) {
    return false;
  }
}

/* Database */

async function checkPostgres(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (err: any) {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

/* S3 */

async function checkS3(): Promise<boolean> {
  return await testS3Connection();
}

/* Route handlers */

export async function GET() {
  const videoProcessorAlive = await checkVideoProcessor();
  const databaseAlive = await checkPostgres();
  const s3Alive = await checkS3();

  const response: JSONResponse = {
    data: {
      app_version: PRIVACYPAL_VERSION,
      video_processor_available: videoProcessorAlive,
      database_available: databaseAlive,
      video_storage_available: s3Alive,
    },
  };
  return Response.json(response);
}
