/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import LoginFlow from "@components/auth/LoginFlow";
import { PalLoginPage } from "@components/auth/LoginForm";
import { PalTextInput } from "@components/form/PalTextInput";
import { Button } from "@patternfly/react-core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
    return (
        <main>
            <LoginFlow />
        </main>
    );
}
