"use client";
/*
 * Created on Tue Oct 10 2023
 * Author: Connor Doman
 */

import "./PatternflyExampleComponent.css";
import { Button } from "@patternfly/react-core";

export const PatternflyExampleComponent = () => {
    return (
        <Button variant="primary" ouiaId="PatternflyExampleComponentPrimaryButton" className="example-button">
            Patternfly Button
        </Button>
    );
};
