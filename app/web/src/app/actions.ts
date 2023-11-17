/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use server";

import db from "@lib/db";
import { getSession } from "@lib/session";
import { User } from "@prisma/client";

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
