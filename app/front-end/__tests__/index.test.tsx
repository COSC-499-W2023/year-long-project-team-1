/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

/* Example Test: Does the page at `/` render a header? (Should FAIL) */
describe("Home Page", () => {
    it("page has 'Test Login' render properly semantic heading", () => {
        render(<Home />);
        expect(screen.getByRole("heading", { name: "Test Login" })).toBeInTheDocument();
    });

    it("homepage is unchanged from snapshot", () => {
        const { container } = render(<Home />);
        expect(container).toMatchSnapshot();
    });
});
