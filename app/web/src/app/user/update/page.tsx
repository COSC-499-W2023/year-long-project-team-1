import { getLoggedInUser } from "@app/actions";
import UserUpdateForm from "@components/user/UserUpdateForm";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
    const user = await getLoggedInUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main>
            <UserUpdateForm user={user} />
        </main>
    );
}