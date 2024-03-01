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
import { testS3BucketAvailability } from "@lib/s3";
import { testLambdaAvailability } from "@lib/lambda";

export const dynamic = "force-dynamic";

/* Database */

async function checkDatabase(): Promise<boolean> {
  try {
    await db.$connect();
    return true;
  } catch (err) {
    return false;
  }
}

/* S3 */

async function checkS3Buckets(): Promise<boolean> {
  const buckets = [
    process.env.PRIVACYPAL_OUTPUT_BUCKET,
    process.env.PRIVACYPAL_TMP_BUCKET,
  ];

  if (buckets.some((b) => !b)) {
    return false;
  }

  return Promise.all(buckets.map((b) => testS3BucketAvailability(b!))).then(
    (results) => results.every((available) => available),
  );
}

/* Lambdas */

async function checkProcessorLambda(): Promise<boolean> {
  const lambda = process.env.PRIVACYPAL_PROCESSOR_LAMBDA;
  if (!lambda) {
    return false;
  }
  return await testLambdaAvailability(lambda);
}

async function checkConversionLambda(): Promise<boolean> {
  const lambda = process.env.PRIVACYPAL_CONVERSION_LAMBDA;
  if (!lambda) {
    return false;
  }
  return await testLambdaAvailability(lambda);
}

/* Route handlers */

export async function GET() {
  const response: JSONResponse = {
    data: {
      app_version: build.version,
      video_processor_available: await checkProcessorLambda(),
      video_conversion_available: await checkConversionLambda(),
      database_available: await checkDatabase(),
      video_storage_available: await checkS3Buckets(),
    },
  };
  return Response.json(response);
}
