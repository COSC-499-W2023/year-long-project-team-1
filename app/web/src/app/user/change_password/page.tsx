import { getLoggedInUser } from "@app/actions";
import ChangePasswordForm from "@components/user/ChangePasswordForm";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
    const user = await getLoggedInUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <main>
            <ChangePasswordForm />
        </main>
    );
}