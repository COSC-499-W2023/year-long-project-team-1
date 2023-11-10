/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */
"use client";
import { PalLoginForm } from "./LoginForm";

interface LoginFlowProps {
    redirectUrl?: string;
}

export const LoginFlow: React.FunctionComponent<LoginFlowProps> = ({ redirectUrl }: LoginFlowProps) => {
    return <PalLoginForm redirectUrl={redirectUrl} />;
};

export default LoginFlow;
