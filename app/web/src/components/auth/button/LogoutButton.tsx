/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { logOut } from "@app/actions";
import { Button } from "@patternfly/react-core";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    redirectTo?: string;
}

export const LogoutButton = ({ redirectTo }: LogoutButtonProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        await logOut(redirectTo ?? "/");
    };

    return (
        <Button variant="primary" onClick={handleLogout}>
            Log out
        </Button>
    );
};
