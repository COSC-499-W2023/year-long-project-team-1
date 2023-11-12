/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */
"use client";
import { useSearchParams } from "next/navigation";
import { PalLoginForm } from "./LoginForm";

export const LoginFlow: React.FunctionComponent = () => {
    // get redirect url from query params
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("r");
    return <PalLoginForm redirectUrl={redirectUrl ?? undefined} />;
};

export default LoginFlow;
