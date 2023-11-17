/*
 * Created on Fri Nov 17 2023
 * Author: Connor Doman
 */
"use client";

import { Button } from "@patternfly/react-core";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push("/api/auth/logout");
    };

    return (
        <Button variant="primary" onClick={handleLogout}>
            Log out
        </Button>
    );
};
