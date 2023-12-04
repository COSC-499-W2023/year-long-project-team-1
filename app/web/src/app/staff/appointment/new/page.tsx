/*
 * Created on Wed Nov 29 2023
 * Author: Connor Doman
 */

import { getLoggedInUser } from "@app/actions";
import NewAppointmentForm from "@components/staff/NewAppointmentForm";
import { redirect } from "next/navigation";

export default async function NewAppointmentPage() {
    const professional = await getLoggedInUser();

    if (!professional) redirect("/login");

    return (
        <main>
            <NewAppointmentForm professionalUser={professional} />
        </main>
    );
}
