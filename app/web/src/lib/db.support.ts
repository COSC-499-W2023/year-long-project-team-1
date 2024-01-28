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
