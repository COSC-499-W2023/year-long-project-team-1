"use client";
/*
 * Created on Tue Oct 10 2023
 * Author: Connor Doman
 */

import "./PatternflyExampleComponent.css";
import { Button } from "@patternfly/react-core";

interface Prop {
    onClick?: () => Promise<void> | void;
}

export const PatternflyExampleComponent = ({onClick}: Prop) => {
    return (
        <Button 
            variant="primary" 
            ouiaId="PatternflyExampleComponentPrimaryButton" 
            className="example-button" 
            onClick={async () => {
                if (onClick) await onClick();
            }}
        >
            Patternfly Button
        </Button>
    );
};
