/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { logOut } from "@app/actions";
import { Button } from "@patternfly/react-core";

interface LogoutButtonProps {
    redirectTo?: string;
}

export const LogoutButton = ({ redirectTo }: LogoutButtonProps) => {
    const handleLogout = async () => {
        await logOut(redirectTo ?? "/");
    };

    return (
        <Button variant="danger" onClick={handleLogout}>
            Log out
        </Button>
    );
};
