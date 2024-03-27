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

"use server";

import { Client } from "@components/staff/NewAppointmentForm";
import {
  PrivacyPalAuthUser,
  getAuthManager,
  privacyPalAuthManagerType,
} from "@lib/auth";
import { CognitoUser, getUsrInGroupList, getUsrList } from "@lib/cognito";
import { DEBUG, IS_TESTING } from "@lib/config";
import { ViewableAppointment } from "@lib/appointment";
import db from "@lib/db";
import { clearSession, getSession, setSession } from "@lib/session";
import { UserRole } from "@lib/userRole";
import { Appointment, Video } from "@prisma/client";
import { User } from "next-auth";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { auth } from "src/auth";
import { getUserHubSlug } from "@lib/utils";
import {
  deleteArtifactFromBucket,
  getOutputBucket,
  getTmpBucket,
} from "@lib/s3";

const actionLog = (...args: any) => {
  if (DEBUG) {
    console.log("[actions.ts]", ...args);
  }
};

// // TODO: replace this with prisma version
// export interface Appointment {
//     date: string;
//     name: string;
// }

/**
 * Get all users from the database
 */
export async function getAllUserData() {
  const users = await getUsrList();
  return users;
}

export async function getUserByUsername(
  username: string,
): Promise<CognitoUser | null> {
  try {
    const users = await getUsrList("username", username);
    if (users && users.length > 0) {
      return users[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function getUserAppointments(user: User) {
  const appointments = await db.appointment.findMany({
    where: {
      OR: [
        {
          clientUsrName: user.username,
        },
        {
          proUsrName: user.username,
        },
      ],
    },
  });

  if (!appointments) {
    return null;
  }

  const appointmentsWithUsers = await Promise.all(
    appointments.map(async (appointment) => {
      const clientRes = await getUsrList("username", appointment.clientUsrName);
      const professionalRes = await getUsrList(
        "username",
        appointment.proUsrName,
      );
      const client =
        clientRes && clientRes.length > 0 ? clientRes[0] : undefined;
      const professional =
        professionalRes && professionalRes.length > 0
          ? professionalRes[0]
          : undefined;

      return {
        professional: `${professional?.firstName} ${professional?.lastName}`,
        client: `${client?.firstName} ${client?.lastName}`,
        ...appointment,
      };
    }),
  );
  return appointmentsWithUsers;
}

export async function getUserAppointmentsDate(user: User) {
  const appointments = await db.appointment.findMany({
    where: {
      OR: [
        {
          clientUsrName: user.username,
        },
        {
          proUsrName: user.username,
        },
      ],
    },
  });

  const appointmentsWithUsers = appointments.map((appointment) => ({
    professional: `${appointment.proUsrName}`,
    client: `${appointment.clientUsrName}`,
    time: new Date(appointment.time).toLocaleString(),
  }));
  return appointmentsWithUsers;
}

export async function getClients() {
  let resultList: Client[] = [];
  const users = await getUsrInGroupList(UserRole.CLIENT);
  users?.forEach((user) => {
    if (user.username) {
      resultList.push({
        username: user.username,
        firstName: user.firstName!,
        lastName: user.lastName!,
        email: user.email!,
      });
    }
  });
  return resultList;
}

export async function getProfessionals() {
  const professionals = await getUsrInGroupList(UserRole.PROFESSIONAL);

  return professionals;
}

/**
 * Get logged in user data
 */
export async function getLoggedInUser(): Promise<null | User> {
  const session = await auth();
  if (session) {
    return session.user;
  } else {
    return null;
  }
}

// TODO: change this to a real message interface from prisma
export interface Message {
  content: string;
  date: string;
  sender: string;
}

export async function getUserRecentMessages(
  username: string,
): Promise<Message[] | null> {
  // TODO: fetch real messages
  const messages: Message[] = [
    {
      sender: "Dr. Peters",
      content: "That is normal.",
      date: new Date(2023, 9, 10).toLocaleDateString(),
    },
    {
      sender: "Dr. Parker",
      content: "We I will forward your results to the lab.",
      date: new Date(2023, 10, 14).toLocaleDateString(),
    },
  ];

  return messages;
}

/* Session Actions */

export async function getAuthSession(): Promise<
  PrivacyPalAuthUser | undefined
> {
  const sessionUser = await getSession();
  return sessionUser;
}

export async function clearAuthSession(): Promise<boolean> {
  const success = await clearSession();
  revalidatePath("/", "layout");
  return success;
}

export async function isLoggedIn(): Promise<boolean> {
  const sessionUser = await getSession();
  return sessionUser !== undefined;
}

export async function logIn(
  email: string,
  password: string,
  redirectTo?: string,
) {
  const authManagerEntity = getAuthManager();

  const user = await authManagerEntity?.authorize({ email, password });

  if (user) {
    user.isLoggedIn = true;
    await setSession(user);
    actionLog("Logged in user:", user, "Redirecting to:", redirectTo ?? "/");
    revalidatePath("/", "layout");
    redirect(redirectTo ?? "/");
  }
}

export async function logOut(redirectTo?: string) {
  const success = await clearSession();
  if (success) {
    actionLog("Logged out user. Redirecting to:", redirectTo ?? "/");
    revalidatePath("/", "layout");
    redirect(redirectTo ?? "/");
  }
}

/**
 * Appointments
 */

export async function createAppointment(
  previousState: number,
  appointmentData: FormData | undefined,
): Promise<number> {
  const professional = await getLoggedInUser();
  if (!professional || professional?.role !== UserRole.PROFESSIONAL)
    throw new Error("User is not a professional");

  if (!appointmentData) throw new Error("No appointment data");

  const chosenClient = appointmentData.get("client-id");
  const allData = appointmentData.getAll("client-id");
  if (chosenClient === null) throw new Error("No client chosen");

  try {
    const createdAppointment = await db.appointment.create({
      data: {
        clientUsrName: chosenClient.toString(),
        proUsrName: professional.username,
        time: new Date(),
      },
    });

    if (createdAppointment) {
      // return appointment id for redirect purposes
      return createdAppointment.id;
    }
  } catch (err: any) {
    console.error(err);
  }

  // return -1 for error
  return -1;
}

export async function getAppointmentsProfessional(professional: User) {
  if (professional.role !== UserRole.PROFESSIONAL)
    throw new Error("User is not a professional");

  const appointments = await db.appointment.findMany({
    where: {
      proUsrName: professional.username,
    },
  });

  return appointments;
}

export async function getAllProfessionalAppointmentDetails(professional: User) {
  if (professional.role !== UserRole.PROFESSIONAL)
    throw new Error("User is not a professional");

  let out: ViewableAppointment[] = [];
  const appointments = await db.appointment.findMany({
    where: {
      proUsrName: professional.username,
    },
  });
  for (const appt of appointments) {
    const clients = await getUsrList("username", appt.clientUsrName);
    if (clients) {
      const client = clients[0];
      out.push({
        id: appt.id,
        clientUser: client,
        professionalUser: professional,
        time: appt.time,
        video_count: await getVideoCount(appt.id),
      });
    } else {
      out.push({
        id: appt.id,
        clientUser: {
          username: "unknown user",
          email: "null",
          lastName: "null",
          firstName: "null",
        },
        professionalUser: professional,
        time: appt.time,
        video_count: await getVideoCount(appt.id),
      });
    }
  }
  return out;
}

/**
 * Find the other user within an appointment
 * @param apptId The appointment to evaluate
 * @param user The current user
 * @returns The other participant in the appointment
 */
export async function getOtherAppointmentUser(
  apptId: number,
  user: User,
): Promise<CognitoUser> {
  const appointment = await db.appointment.findUnique({
    where: {
      id: apptId,
    },
  });

  if (!appointment) throw new Error("No appointment found");

  // separates users by role and then finds the best match (smallest matching prefix) from Cognito
  if (user.role === UserRole.CLIENT) {
    const professionals = await getUsrList(
      "username",
      appointment.proUsrName,
      "=",
    );
    if (professionals && professionals.length > 0) {
      return professionals[0];
    }
  } else if (user.role === UserRole.PROFESSIONAL) {
    const clients = await getUsrList(
      "username",
      appointment.clientUsrName,
      "=",
    );
    if (clients && clients.length > 0) {
      return clients[0];
    }
  }
  throw new Error("No other user found");
}

export async function getAppointmentsClient(client: User) {
  if (client.role !== UserRole.CLIENT)
    throw new Error("User is not a professional");

  const appointments = await db.appointment.findMany({
    where: {
      clientUsrName: client.username,
    },
  });

  return appointments;
}

/**
 * Find a single appointment with its ID.
 * @param id appointment ID to search for
 * @returns the found appointment, null otherwise
 */
export async function getAppointment(id: number): Promise<Appointment | null> {
  try {
    const appointment = await db.appointment.findUnique({
      where: {
        id,
      },
    });
    return appointment;
  } catch (err: any) {
    console.error(`Error finding appointment with ID ${id}: ${err}`);
  }
  return null;
}

export interface AppointmentMetadata {
  apptId: number;
  apptDate: number;
  contact: CognitoUser | undefined;
}

export async function getAppointmentMetadata(
  user: User,
): Promise<AppointmentMetadata[]> {
  const appointments = await db.appointment.findMany({
    where: {
      OR: [
        {
          proUsrName: user.username,
        },
        {
          clientUsrName: user.username,
        },
      ],
    },
  });

  const apptMetadata: AppointmentMetadata[] = [];
  for (let appt of appointments) {
    const contactUsername =
      appt.clientUsrName === user.username
        ? appt.proUsrName
        : appt.clientUsrName;

    const contactList = await getUsrList("username", contactUsername, "=");
    if (contactList && contactList.length > 0) {
      apptMetadata.push({
        apptId: appt.id,
        apptDate: appt.time.valueOf(), // ms since epoch
        contact: contactList.at(0),
      });
    } else {
      apptMetadata.push({
        apptId: appt.id,
        apptDate: appt.time.valueOf(), // ms since epoch
        contact: {
          username: "unknown-user",
          email: "unknown@unknown.com",
          firstName: "Unknown",
          lastName: "User",
        },
      });
    }
  }
  return apptMetadata;
}

export async function getVideoCount(id: number) {
  return await db.video.count({
    where: {
      apptId: id,
    },
  });
}

/**
 * Deletes a video upload from the database.
 * @param awsRef the AWS filename of the video
 * @returns true if the video was deleted from the database, false otherwise
 */
export async function deleteVideo(awsRef: string) {
  await db.video.delete({
    where: {
      awsRef,
    },
  });
}

/**
 * Check the database to see if a video exists for a user's appointment.
 * @param apptId Appointment ID in the database
 * @param awsRef AWS filename of the video
 * @param username the username of someone in the appointment
 * @returns true if the video exists, false otherwise
 */
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

export async function redirectAfterReview(user: User) {
  redirect(`${getUserHubSlug(user)}/appointments`);
}

/**
 * Cancel the processing of a video by deleting from the database and S3 input bucket.
 * @param awsRef the AWS filename of the video
 */
export async function cancelVideoProcessing(awsRef: string): Promise<void> {
  // delete the video from the database
  // as long as the video is at least deleted from the DB the user's experience will be consistent
  const videoExists = await db.video.findUnique({
    where: {
      awsRef,
    },
  });

  if (videoExists) {
    await deleteVideo(awsRef);
  }

  // delete the video from aws output bucket
  const s3OutputDeleteParams = {
    bucket: getOutputBucket(),
    key: awsRef,
  };
  await deleteArtifactFromBucket(s3OutputDeleteParams);

  // delete the video from aws tmp bucket
  const s3TmpDeleteParams = {
    bucket: getTmpBucket(),
    key: awsRef,
  };
  await deleteArtifactFromBucket(s3TmpDeleteParams);
}
