/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use server";

import db from "@lib/db";
import { clearSession, getSession } from "@lib/session";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO: replace this with prisma version
export interface Appointment {
    date: string;
    name: string;
}

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

/**
 * Get logged in user data
 */
export async function getLoggedInUser(): Promise<User | null> {
    const sessionUser = await getSession();

    const id: number = typeof sessionUser?.id === "string" ? parseInt(sessionUser?.id) : (sessionUser?.id as number);

    const user = await oneUser(id);

    return user;
}

/**
 * Get appointment data for a user
 * @param id User id
 */
export async function getUserAppointments(id: number): Promise<Appointment[] | null> {
    // TODO: Real implementaiton might look like this
    // const appointments = await db.appointment.findMany({
    //     where: {
    //         userId: id,
    //     },
    // });

    const appointments: Appointment[] = [
        { date: new Date(2023, 9, 10).toLocaleDateString(), name: "Appointment 1" },
        { date: new Date(2023, 10, 14).toLocaleDateString(), name: "Appointment 2" },
    ];

    return appointments;
}

/* Session Actions */

export async function logOut(redirectTo: string) {
    const success = await clearSession();
    if (!success) {
        return false;
    }
    revalidatePath(redirectTo);
    redirect(redirectTo);
}
