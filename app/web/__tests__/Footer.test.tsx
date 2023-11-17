/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "@components/Footer";

describe("Footer", () => {
    it("matches snapshot", () => {
        const wrapper = render(<Footer />);
        expect(wrapper).toMatchSnapshot();
    });

    it("contains an HTML footer element", () => {
        render(<Footer />);
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the site logo", () => {
        render(<Footer />);
        const logo = screen.getByRole("link", { name: "PrivacyPal logo" });
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute("href", "/");
    });

    it("renders the site links", () => {
        render(<Footer />);
        expect(screen.getByRole("link", { name: "Welcome" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "About Us" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
    });

    it("renders social media links", () => {
        render(<Footer />);
        expect(screen.getByRole("link", { name: "GitHub logo" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "YouTube logo" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "mail icon" })).toBeInTheDocument();
    });
});
