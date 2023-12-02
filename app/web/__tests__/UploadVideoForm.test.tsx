import { render, screen, fireEvent } from "@testing-library/react";
import UploadVideoForm from "@components/upload/UploadVideoForm";
import "@testing-library/jest-dom";

describe("Page", () => {
    it("UploadVideoForm matches snapshot", () => {
        const snap = render(<UploadVideoForm />);
        expect(snap).toMatchSnapshot();
    });

    it("UploadVideoForm contains both buttons", () => {
        render(<UploadVideoForm />);
        expect(screen.getByRole("button", { name: "Record video" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit video" })).toBeInTheDocument();
    });

    it("UploadVideoForm has a file input component", () => {
        render(<UploadVideoForm />);
        expect(screen.getByAltText("file upload")).toBeInTheDocument();
    });
});
