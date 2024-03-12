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
import "@testing-library/jest-dom";
import { ProfileDetails } from "@components/user/ProfileDetails";
import { render, screen } from "@testing-library/react";
import { User } from "next-auth";

describe("ProfileDetails Component", () => {
    const user: User = {
        id: 1,
        username: "test_user",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "client",
    };

    it("renders component with user information", () => {
        render(<ProfileDetails user={user} />);
        expect(screen.queryByText("Username:")).toBeInTheDocument();
        expect(screen.queryByText(user.username)).toBeInTheDocument();
        expect(screen.queryByText("Email:")).toBeInTheDocument();
        expect(screen.queryByText(user.email)).toBeInTheDocument();
        expect(screen.queryByText("Full Name:")).toBeInTheDocument();
        expect(
            screen.queryByText(`${user.firstName} ${user.lastName}`),
        ).toBeInTheDocument();
        expect(screen.queryByText("Role:")).toBeInTheDocument();
        expect(screen.queryByText(user.role || "N/A")).toBeInTheDocument();
    });
    it("renders profile picture with tooltip", () => {
        render(<ProfileDetails user={user} />);
        const profilePicture = screen.queryByAltText("Profile picture");
        expect(profilePicture).toBeInTheDocument();
    });
});
