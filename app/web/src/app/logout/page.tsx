/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

import LogoutHandler from "@components/auth/LogoutHandler";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
    // redirect("/api/auth/logout");
    return <LogoutHandler />;
}
