import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { User } from "next-auth";
import { Role } from "@prisma/client";
import NavigationBar from "@components/layout/NavigationBar";

describe("NavigationBar", () => {
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
    const wrapper = render(<NavigationBar user={testUser} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("generates an HTML header element", () => {
    render(<NavigationBar user={testUser} />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the site logo", () => {
    render(<NavigationBar user={testUser} />);
    const logo = screen.getByAltText("PrivacyPal Shield Logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders a link to /", () => {
    render(<NavigationBar user={testUser} />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows a login link when no user is provided", () => {
    render(<NavigationBar />);
    const link = screen.getByRole("button", { name: "Sign in" });
    expect(link).toBeInTheDocument();
  });

  it("shows a logout link when a user is provided", () => {
    render(<NavigationBar user={testUser} />);
    const link = screen.getByRole("button", { name: "Sign out" });
    expect(link).toBeInTheDocument();
  });
});
