/*
 * Created on Sun Oct 22 2023
 * Author: Connor Doman
 */

import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import "@testing-library/jest-dom";

/* Example Test: Does the page at `/` render a header? (Should FAIL) */
describe("Home", () => {
    it("page has 'PrivacyPal' semantic heading", () => {
        render(<Home useAuth={false} />);
        expect(screen.getByRole("heading", { name: "PrivacyPal" })).toBeInTheDocument();
    });

    it("homepage is unchanged from snapshot", () => {
        const { container } = render(<Home useAuth={false} />);
        expect(container).toMatchSnapshot();
    });
});
