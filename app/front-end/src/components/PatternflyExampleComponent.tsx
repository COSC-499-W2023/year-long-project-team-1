"use client";
/*
 * Created on Tue Oct 10 2023
 * Author: Connor Doman
 */

import { Button } from "@patternfly/react-core";
import "./PatternflyExampleComponent.css";

export const PatternflyExampleComponent = () => {
    return (
        <Button variant="primary" ouiaId="PatternflyExampleComponentPrimaryButton" className="example-button">
            Patternfly Button
        </Button>
    );
};
