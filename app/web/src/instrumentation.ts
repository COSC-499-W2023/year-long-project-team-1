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
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { createS3Bucket, getBucketName, isOwnedBucketExistException } =
      await import("@lib/s3");
    const bucket = getBucketName();
    try {
      const resp = await createS3Bucket(bucket);
      console.log(`Bucket ${resp.Location} created.`);
    } catch (e) {
      if (isOwnedBucketExistException(e)) {
        console.log(`Bucket ${bucket} already exists. Nothing changed.`);
        return;
      }
      throw e;
    }
  }
}
