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

import { LogoutButton } from "@components/auth/button/LogoutButton";
import { PrivacyPalAuthUser } from "@lib/auth";
import { Card, CardBody, CardFooter, CardTitle } from "@patternfly/react-core";
import { User } from "@prisma/client";

interface ExampleUserCardProps {
    user: PrivacyPalAuthUser | User;
}

export const ExampleUserCard = ({ user }: ExampleUserCardProps) => {
    return (
        <Card>
            <CardTitle>Example User Card for {user.email}</CardTitle>
            <CardBody>
                <pre>{JSON.stringify(user, null, 4)}</pre>
            </CardBody>
            <CardFooter>
                <LogoutButton />
            </CardFooter>
        </Card>
    );
};
