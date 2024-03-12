"use client";
import { GithubIcon } from "@patternfly/react-icons";
import Github from "next-auth/providers/github";

export const GithubIconImage: React.FunctionComponent = () => {
    return (
        <GithubIcon style={{ fontSize: '2rem' }} />
    );
};