/*
 * Created on Mon Oct 23 2023
 * Author: Connor Doman
 */
"use client";
/*
    Adapted from: https://www.patternfly.org/components/text-input-group
*/

import React, { useState } from "react";
import { Label, TextInput, TextInputGroup, TextInputGroupMain } from "@patternfly/react-core";

export interface TextInputProps {
    label?: string;
    placeholder?: string;
    initialValue?: string;
    onChange?: (value: string) => void;
}

export const PalTextInput: React.FunctionComponent<TextInputProps> = ({
    label,
    placeholder,
    initialValue,
    onChange,
}: TextInputProps) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event: React.FormEvent<HTMLInputElement>, newValue: string) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <TextInputGroup>
            {label ? (
                <>
                    <div>{label}</div>
                </>
            ) : null}
            <TextInput onChange={handleChange} placeholder={placeholder} value={value} />
        </TextInputGroup>
    );
};
