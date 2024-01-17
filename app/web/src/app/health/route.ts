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
