/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use server";

import db from "@lib/db";

/* User Data Actions */
const userQuery = () => db.user.findMany();

/**
 * Get all users from the database
 */
export async function getAllUserData() {
    let users = await userQuery();
    return users;
}
