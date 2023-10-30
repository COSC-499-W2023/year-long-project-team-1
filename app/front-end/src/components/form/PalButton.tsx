/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";

import { Button } from "@patternfly/react-core";
/*
    https://www.patternfly.org/components/button
*/

interface ButtonProps {
    text?: string;
    children?: React.ReactNode;
    onClick?: () => void;
}

export const PrimaryButton = ({ text, children, onClick }: ButtonProps) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Button variant="primary" ouiaId="Primary" onClick={handleClick}>
            {children ? children : text}
        </Button>
    );
};
