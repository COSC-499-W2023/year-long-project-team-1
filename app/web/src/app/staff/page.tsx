/*
 * Created on Thu Nov 02 2023
 * Author: Connor Doman
 */

import Link from "next/link";

import { TestUserList } from "@components/staff/TestUserList";

export default function StaffPage() {
    return (
        <>
            <TestUserList />
            <Link href="/staff/appointment/new">Create New Appointment</Link>
        </>
    );
}
