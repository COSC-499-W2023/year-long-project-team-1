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
import { render, screen } from "@testing-library/react";
import ProfilePicture from "@components/layout/ProfilePicture";
import { User } from "next-auth";

describe("ProfilePicture", () => {
  const testUser: User = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    role: "client",
    email: "testuser@example.com",
  };

  it("matches snapshot", () => {
    const wrapper = render(<ProfilePicture user={testUser} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("renders the user's avatar", () => {
    render(<ProfilePicture user={testUser} />);
    const avatar = screen.getByAltText("Profile picture");
    expect(avatar).toBeInTheDocument();
  });

  it("renders the user's username", () => {
    render(<ProfilePicture user={testUser} />);
    const username = screen.getByText(testUser.username);
    expect(username).toBeInTheDocument();
  });

  it("renders the user's role", () => {
    render(<ProfilePicture user={testUser} />);
    const role = screen.getByText(testUser.role);
    expect(role).toBeInTheDocument();
  });
});
