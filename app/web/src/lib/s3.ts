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
import {
  S3Client,
  CreateBucketCommand,
  CreateBucketCommandInput,
  BucketLocationConstraint,
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  ListBucketsCommand,
} from "@aws-sdk/client-s3";
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

export function isOwnedBucketExistException(
  e: any,
): e is BucketAlreadyOwnedByYou {
  return e instanceof BucketAlreadyOwnedByYou;
}

export function isBucketExistException(e: any): e is BucketAlreadyExists {
  return e instanceof BucketAlreadyExists;
}

export function generateObjectKey(filename: string, userId: string) {
  return path.join(userId, filename);
}

export async function createS3Bucket(bucket: string) {
  const clientRegion = await getRegion();
  const params: CreateBucketCommandInput = {
    Bucket: bucket,
    CreateBucketConfiguration: {
      LocationConstraint: clientRegion as BucketLocationConstraint,
    },
  };
  const createCmd = new CreateBucketCommand(params);
  return await client.send(createCmd);
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

/**
 * Attempts to list buckets in S3. This acts as a proxy for checking if the
 * bucket exists and is accessible.
 * @returns true if the bucket exists and is accessible
 */
export async function testS3Connection(): Promise<boolean> {
  try {
    await client.send(new ListBucketsCommand({}));
    return true;
  } catch (err: any) {
    return false;
  }
}
