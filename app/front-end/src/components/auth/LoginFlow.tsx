/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */
"use client";
import { ActionList, ActionListItem, Button, Card, CardBody, CardTitle } from "@patternfly/react-core";
import { signOut, useSession } from "next-auth/react";
import { PalLoginForm } from "./LoginForm";
import style from "@assets/style";

interface LoginFlowProps {
    redirectUrl?: string;
}

export const LoginFlow: React.FunctionComponent<LoginFlowProps> = ({ redirectUrl }: LoginFlowProps) => {
    return <PalLoginForm redirectUrl={redirectUrl} />;
};

export default LoginFlow;
