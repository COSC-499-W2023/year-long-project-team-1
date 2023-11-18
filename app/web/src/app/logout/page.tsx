/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use server";

import { redirect } from "next/navigation";

export default async function LogoutPage() {
    redirect("/api/auth/logout");
}
