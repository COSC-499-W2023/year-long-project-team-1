/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */

import { getLoggedInUser } from "@app/actions";
import UserDashboard from "@components/user/UserDashboard";

export default async function UserDashboardPage() {
    const user = await getLoggedInUser();

    return (
        <main>
            <UserDashboard user={user} />
        </main>
    );
}
