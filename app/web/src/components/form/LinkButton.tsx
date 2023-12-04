/*
 * Created on Sat Dec 02 2023
 * Author: Connor Doman
 */

import { Button } from "@patternfly/react-core";
import Link from "next/link";

interface LinkButtonProps {
    href: string;
    label: string;
}

export const LinkButton = ({ href, label }: LinkButtonProps) => {
    return (
        <Button component={Link} variant="primary" href={href}>
            {label}
        </Button>
    );
};

export default LinkButton;
