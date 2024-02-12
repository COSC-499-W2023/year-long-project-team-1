import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfilePicture from "@components/layout/ProfilePicture";
import { User } from "next-auth";
import { Role } from "@prisma/client";

describe("ProfilePicture", () => {
  const testUser: User = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    role: Role.CLIENT,
    email: "testuser@example.com",
    phone_number: "+1234567890",
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

  it("has a title attribute", () => {
    render(<ProfilePicture user={testUser} tooltip="Test tooltip" />);
    const avatar = screen.getByRole("link");
    expect(avatar).toHaveAttribute("title", "Test tooltip");
  });

  it("links to the user dashboard", () => {
    render(<ProfilePicture user={testUser} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/user/dashboard");
  });
});
