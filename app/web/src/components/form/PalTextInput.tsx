/*
 * Copyright [2023] [Privacypal Authors]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
