/*
 * Created on Mon Oct 30 2023
 * Author: Connor Doman
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Header } from "@components/Header";

describe("Header", () => {
    it("matches snapshot", () => {
        const wrapper = render(<Header />);
        expect(wrapper).toMatchSnapshot();
    });

    it("contains an HTML header element", () => {
        render(<Header />);
        expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders the header", () => {
        render(<Header />);
        expect(screen.getByRole("heading", { name: "A SOLUTION TO ABSOLUTE PRIVACY." })).toBeInTheDocument();
    });

    it("renders the header image", () => {
        render(<Header />);
        expect(screen.getByRole("img", { name: "logo" })).toBeInTheDocument();
    });
});
