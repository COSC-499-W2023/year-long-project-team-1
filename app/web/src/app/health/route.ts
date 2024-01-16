/*
 * Created on Tue Jan 16 2024
 * Author: Connor Doman
 */

/*
{
  "app_version": "0.1.0-beta1",
  "video_processor_available": true, // Lambda
  "database_available": true, // postgreSQL 
  "video_storage_available": true // s3 (bucket created/accessible)
}
 */

import { JSONResponse } from "@lib/response";

export async function GET() {
  const response: JSONResponse = {
    data: {
      app_version: "0.1.0-beta1",
      video_processor_available: true,
      database_available: true,
      video_storage_available: true,
    },
  };
  return Response.json(response);
}
