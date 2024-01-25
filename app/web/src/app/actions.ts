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

import { ViewableAppointment } from "@lib/appointment";
import {
  PrivacyPalAuthUser,
  getAuthManager,
  privacyPalAuthManagerType,
} from "@lib/auth";
import { DEBUG, IS_TESTING } from "@lib/config";
import db from "@lib/db";
import { clearSession, getSession, setSession } from "@lib/session";
import { Appointment, Role, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

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
const allUsers = () => db.user.findMany();
const oneUser = (id: number) => db.user.findUnique({ where: { id } });

/**
 *
 * @param attributes
 * @returns
 */
export async function findOneUserBy(attributes: {
  id?: number;
  username?: string;
  email?: string;
}) {
  try {
    const { id, username, email } = attributes;
    const user = await db.user.findUnique({ where: { id, username, email } });
    return user;
  } catch (err: any) {
    console.error(err);
  }
  return null;
}

/**
 *
 * @param email the email of the user to find
 * @returns a User object or null if no user is found with that email
 */
export async function findUserByEmail(email: string) {
  return findOneUserBy({ email });
}

/**
 * Finds exactly one user by id or null otherwise
 * @param id the id of the user to find
 * @returns a User object or null if no user is found with that id
 */
export async function findUserById(id: number) {
  return findOneUserBy({ id });
}

/**
 * Finds exactly one user by id and removes the password field from the returned object
 * @param id the id of the user to find
 * @returns a User object with the password field removed
 */
export async function findUserSanitizedById(
  id: number,
): Promise<Omit<User, "password"> | null> {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
  return user;
}

/**
 * Get all users from the database
 */
export async function getAllUserData() {
  const users = await allUsers();
  return users;
}

export async function getUserAppointments(user: User) {
  const appointments = await db.appointment.findMany({
    where: {
      OR: [
        {
          clientId: user.id,
        },
        {
          proId: user.id,
        },
      ],
    },
  });

  const appointmentsWithUsers: ViewableAppointment[] = await Promise.all(
    appointments.map(async (appointment) => {
      const client: User | null = await db.user.findUnique({
        where: { id: appointment.clientId },
      });
      const professional: User | null = await db.user.findUnique({
        where: { id: appointment.proId },
      });

      return {
        ...appointment,
        clientUser: client,
        professionalUser: professional,
      };
    }),
  );
  return appointmentsWithUsers;
}

export async function getClients() {
  const clients = await db.user.findMany({
    where: {
      role: Role.CLIENT,
    },
  });

  return clients;
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
export async function getLoggedInUser(): Promise<User | null> {
  const sessionUser = await getSession();

  const id: number =
    typeof sessionUser?.id === "string"
      ? parseInt(sessionUser?.id)
      : (sessionUser?.id as number);

  const user = await oneUser(id);

  return user;
}

// TODO: change this to a real message interface from prisma
export interface Message {
  content: string;
  date: string;
  sender: string;
}

export async function getUserRecentMessages(
  id: number,
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
  const authManager = getAuthManager();

  const user = await authManager?.authorize({ email, password });

  if (user) {
    user.isLoggedIn = true;
    await setSession(user);
    actionLog("Logged in user:", user, "Redirecting to:", redirectTo ?? "/");
    revalidatePath("/", "layout");
    redirect(redirectTo ?? "/");
  }
  throw new Error("Invalid credentials");
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
  console.log(appointmentData);
  if (!appointmentData) throw new Error("No appointment data");

  const professional = await getLoggedInUser();
  // if (professional?.role !== "PROFESSIONAL") throw new Error("User is not a professional");

  const chosenClient = appointmentData.get("client-id");
  const allData = appointmentData.getAll("client-id");
  console.log(allData);
  if (chosenClient === null) throw new Error("No client chosen");

  const client = await db.user.findUnique({
    where: { id: parseInt(chosenClient as string) },
  });

  try {
    const createdAppointment = await db.appointment.create({
      data: {
        client: {
          connect: {
            id: client?.id,
          },
        },
        professional: {
          connect: {
            id: professional?.id,
          },
        },
        time: new Date(),
      },
    });

    if (createdAppointment) {
      const formData = new FormData();
      formData.append("appointmentId", createdAppointment.id.toString());
      formData.append("client", createdAppointment.clientId.toString());
      formData.append("professional", createdAppointment.proId.toString());
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
      proId: professional.id,
    },
  });

  return appointments;
}

export async function getProfessionalAppointment(
  professional: User,
  apptId: number,
) {
  if (professional.role !== Role.PROFESSIONAL)
    throw new Error("User is not a professional");

  const appointment = await db.appointment.findUnique({
    where: {
      id: apptId,
    },
  });

  return appointment;
}

export async function getAppointmentsClient(client: User) {
  if (client.role !== Role.CLIENT)
    throw new Error("User is not a professional");

  const appointments = await db.appointment.findMany({
    where: {
      clientId: client.id,
    },
  });

  return appointments;
}
