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
import { UsrListInfo } from "@components/staff/TestUserList";
import {
  PrivacyPalAuthUser,
  getAuthManager,
  privacyPalAuthManagerType,
} from "@lib/auth";
import { getUsrInGroupList, getUsrList } from "@lib/cognito";
import { DEBUG, IS_TESTING } from "@lib/config";
import db from "@lib/db";
import { clearSession, getSession, setSession } from "@lib/session";
import { Appointment, Role, User } from "@prisma/client";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { auth, authManager } from "src/auth";

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

/* User Data Actions */
const allUsersFromPostgresql = () => db.user.findMany();
const oneUser = (id: number) => db.user.findUnique({ where: { id } });

/**
 * Get all users from the database
 */
export async function getAllUserData() {
  let resultList: UsrListInfo[] = [];
  if (authManager == "cognito") {
    const users = await getUsrList();
    users?.forEach((u) => {
      if (u.username) {
        resultList.push({
          username: u.username,
          firstName: u.givenName,
          lastName: u.familyName,
          email: u.email,
        });
      }
    });
  } else {
    const users = await allUsersFromPostgresql();
    users.forEach((u) => {
      resultList.push({
        username: u.username,
        firstName: u.firstname,
        lastName: u.lastname,
        email: u.email,
      });
    });
  }
  return resultList;
}

export async function getUserAppointments(user: Session["user"]) {
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
      const client: User | null = await db.user.findUnique({
        where: { username: appointment.clientUsrName },
      });
      const professional: User | null = await db.user.findUnique({
        where: { username: appointment.proUsrName },
      });

      return {
        professional: `${professional?.firstname} ${professional?.lastname}`,
        client: `${client?.firstname} ${client?.lastname}`,
        ...appointment,
      };
    }),
  );
  return appointmentsWithUsers;
}

export async function getClients() {
  let resultList: Client[] = [];
  if (authManager == "cognito") {
    const users = await getUsrInGroupList("client");
    users?.forEach((user) => {
      if (user.username) {
        resultList.push({
          username: user.username,
          firstName: user.givenName,
          lastName: user.familyName,
          email: user.email,
        });
      }
    });
  } else {
    const clients = await db.user.findMany({
      where: {
        role: Role.CLIENT,
      },
    });
    clients.forEach((client) => {
      resultList.push({
        username: client.username,
        firstName: client.firstname,
        lastName: client.lastname,
        email: client.email,
      });
    });
  }

  return resultList;
}

export async function getProfessionals() {
  const professionals = await db.user.findMany({
    where: {
      role: Role.PROFESSIONAL,
    },
  });

  return professionals;
}

/**
 * Get logged in user data
 */
export async function getLoggedInUser(): Promise<null | Session["user"]> {
  const session = await auth();
  if (session) {
    console.info("User is logged in", session.user);
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
  previousState: FormData | undefined,
  appointmentData: FormData | undefined,
): Promise<FormData | undefined> {
  console.log("creating appointment");
  if (!appointmentData) throw new Error("No appointment data");

  const professional = await getLoggedInUser();
  if (!professional || professional?.role !== "professional")
    throw new Error("User is not a professional");

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
      const formData = new FormData();
      formData.append("appointmentId", createdAppointment.id.toString());
      formData.append("client", createdAppointment.clientUsrName);
      formData.append("professional", createdAppointment.proUsrName);
      return formData;
    }
  } catch (err: any) {
    console.error(err);
  }

  return undefined;
}

export async function getAppointmentsProfessional(professional: User) {
  if (professional.role !== Role.PROFESSIONAL)
    throw new Error("User is not a professional");

  const appointments = await db.appointment.findMany({
    where: {
      proUsrName: professional.username,
    },
  });

  return appointments;
}

export async function getAppointmentsClient(client: User) {
  if (client.role !== Role.CLIENT)
    throw new Error("User is not a professional");

  const appointments = await db.appointment.findMany({
    where: {
      clientUsrName: client.username,
    },
  });

  return appointments;
}
