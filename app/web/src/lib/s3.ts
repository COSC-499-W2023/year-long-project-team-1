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
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs, { PathLike } from "fs";
import path from "path";

// Client configurations are set via environment variables
export const client = new S3Client();

export async function getRegion() {
  return client.config.region();
}

export function getBucketName() {
  return process.env.PRIVACYPAL_S3_BUCKET || "privacypal";
}

export function generateObjectKey(filename: string, userId: string) {
  return path.join(userId, filename);
}

export interface S3UploadConfig {
  bucket?: string; // Use default bucket
  key: string;
  path: PathLike;
  metadata?: Record<string, string>;
}

export async function uploadArtifact({
  bucket = getBucketName(),
  key,
  metadata,
  path,
}: S3UploadConfig) {
  const stream = fs.createReadStream(path);
  const s3Upload = new Upload({
    client: client,
    params: {
      Bucket: bucket,
      Key: key,
      Metadata: metadata,
      Body: stream,
    },
  });
  return await s3Upload.done();
}
