/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use server";

import { PrivacyPalAuthUser, getAuthManager, privacyPalAuthManagerType } from "@lib/auth";
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
 * Get all users from the database
 */
export async function getAllUserData() {
    const users = await allUsers();
    return users;
}

export async function getClients() {
    const clients = await db.user.findMany({
        where: {
            role: Role.CLIENT,
        },
    });

    return clients;
}

/**
 * Get logged in user data
 */
export async function getLoggedInUser(): Promise<User | null> {
    const sessionUser = await getSession();

    const id: number = typeof sessionUser?.id === "string" ? parseInt(sessionUser?.id) : (sessionUser?.id as number);

    const user = await oneUser(id);

    return user;
}

// TODO: change this to a real message interface from prisma
export interface Message {
    content: string;
    date: string;
    sender: string;
}

export async function getUserRecentMessages(id: number): Promise<Message[] | null> {
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

export async function getAuthSession(): Promise<PrivacyPalAuthUser | undefined> {
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

export async function logIn(email: string, password: string, redirectTo?: string) {
    const authManager = getAuthManager();

    const user = await authManager?.authorize({ email, password });

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

export async function createAppointment(appointmentData: FormData) {
    console.log("creating appointment");
    const professional = await getLoggedInUser();
    // if (professional?.role !== "PROFESSIONAL") throw new Error("User is not a professional");

    const chosenClient = appointmentData.get("client");
    if (chosenClient === null) throw new Error("No client chosen");

    const client = await db.user.findUnique({ where: { id: parseInt(chosenClient as string) } });

    const success = await db.appointment.create({
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
        },
    });

    return success;
}

export async function getAppointmentsProfessional(professional: User) {
    if (professional.role !== Role.PROFESSIONAL) throw new Error("User is not a professional");

    const appointments = await db.appointment.findMany({
        where: {
            proId: professional.id,
        },
    });

    return appointments;
}

export async function getAppointmentsClient(client: User) {
    if (client.role !== Role.CLIENT) throw new Error("User is not a professional");

    const appointments = await db.appointment.findMany({
        where: {
            clientId: client.id,
        },
    });

    return appointments;
}
