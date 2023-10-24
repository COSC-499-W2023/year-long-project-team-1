/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";
/*
    Adapted from: https://www.patternfly.org/components/text-input-group
*/

import React from "react";
import { TextInputGroup, TextInputGroupMain } from "@patternfly/react-core";

export const TextInputGroupBasic: React.FunctionComponent = () => (
    <TextInputGroup>
        <TextInputGroupMain />
    </TextInputGroup>
);
