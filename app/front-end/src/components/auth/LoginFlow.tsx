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
    // const { data: session, status } = useSession();

    // if (status === "loading") {
    //     return <div>Loading...</div>;
    // }

    // if (status === "authenticated") {
    //     return (
    //         <Card style={style.card}>
    //             <CardTitle component="h1">You are logged in</CardTitle>
    //             <CardBody style={style.cardBody}>
    //                 <pre>{JSON.stringify(session, null, 4)}</pre>
    //                 <ActionList>
    //                     <ActionListItem>
    //                         <Button onClick={() => signOut()}>Sign out</Button>
    //                     </ActionListItem>
    //                 </ActionList>
    //             </CardBody>
    //         </Card>
    //     );
    // }

    return <PalLoginForm redirectUrl={redirectUrl} />;
};

export default LoginFlow;
