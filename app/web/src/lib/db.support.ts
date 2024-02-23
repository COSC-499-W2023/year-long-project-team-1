import db from "./db";

export async function checkIfVideoExists(
  apptId: number,
  awsRef: string,
  username: string,
) {
  const videoCount = await db.video.count({
    where: {
      AND: [
        { apptId },
        { awsRef },
        {
          appt: {
            OR: [{ proUsrName: username }, { clientUsrName: username }],
          },
        },
      ],
    },
  });

  // no video found for this user's appointment (should only be 1 instance if it exists)
  return videoCount === 1;
}
