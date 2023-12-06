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
