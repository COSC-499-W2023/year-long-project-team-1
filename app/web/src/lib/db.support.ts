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
import db from "./db";

/**
 * Deletes a video upload from the database.
 * @param awsRef the AWS filename of the video
 * @returns true if the video was deleted from the database, false otherwise
 */
export async function deleteVideo(awsRef: string): Promise<boolean> {
  try {
    await db.video.delete({
      where: {
        awsRef,
      },
    });
  } catch (err) {
    console.error(`Failed to delete video: ${awsRef} from database`, err);
    return false;
  }

  return true;
}
