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
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  DeleteObjectTaggingCommand,
  GetObjectTaggingCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs, { PathLike } from "fs";
import path from "path";

// Client configurations are set via environment variables
export const client = new S3Client();

export async function getRegion() {
  return client.config.region();
}

export function getOutputBucket() {
  return process.env.PRIVACYPAL_OUTPUT_BUCKET || "";
}

export function getTmpBucket() {
  return process.env.PRIVACYPAL_TMP_BUCKET || "";
}

export function generateObjectKey(filename: string, userId: string) {
  return path.join(userId, filename);
}

export interface S3ObjectInfo {
  bucket: string;
  key: string;
}
export interface S3PathUploadConfig extends S3ObjectInfo {
  path: PathLike;
  metadata?: Record<string, string>;
}

export interface S3FileUploadConfig extends S3ObjectInfo {
  file: File;
  metadata?: Record<string, string>;
}

export async function uploadArtifactFromPath({
  bucket,
  key,
  metadata,
  path,
}: S3PathUploadConfig) {
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
export async function testS3BucketAvailability(
  bucket: string,
): Promise<boolean> {
  try {
    const command = new HeadBucketCommand({
      Bucket: bucket,
    });
    await client.send(command);
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export async function putArtifactFromFileRef({
  bucket,
  key,
  metadata,
  file,
}: S3FileUploadConfig) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const putCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: metadata,
    Body: buffer,
  });
  return await client.send(putCommand);
}

export async function deleteArtifact(key: string, bucket: string) {
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function getArtifactFromBucket({ bucket, key }: S3ObjectInfo) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await client.send(command);
}

export function createPresignedUrl({ bucket, key }: S3ObjectInfo) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function deleteObjectTags({ bucket, key }: S3ObjectInfo) {
  const command = new DeleteObjectTaggingCommand({
    Bucket: bucket,
    Key: key,
  });
  await client.send(command);
}

export async function getObjectMetaData({ bucket, key }: S3ObjectInfo) {
  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  return await client.send(command);
}

export async function getObjectTags({ bucket, key }: S3ObjectInfo) {
  const command = new GetObjectTaggingCommand({ Bucket: bucket, Key: key });
  return await client.send(command);
}
