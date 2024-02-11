import { render, screen } from "@testing-library/react";
import LoadingButton from "@components/form/LoadingButton";
import "@testing-library/jest-dom";

describe("LoadingButton", () => {
  it("should render a button", () => {
    render(<LoadingButton />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a Link when href is provided", () => {
    render(<LoadingButton href="/example" />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(<LoadingButton>Click me</LoadingButton>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should render a spinner when isLoading is true", () => {
    render(<LoadingButton isLoading={true} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should have working click listener", () => {
    let incrementTest = 0;
    const testOnClick = (e: React.MouseEvent) => {
      incrementTest++;
    };
    render(<LoadingButton onClick={testOnClick} />);
    screen.getByRole("button").click();
    expect(incrementTest).toBe(1);
  });

  it("should disable disable onClick when isLoading is true", () => {
    let incrementTest = 0;
    const testOnClick = (e: React.MouseEvent) => {
      incrementTest++;
    };
    render(<LoadingButton isLoading={true} onClick={testOnClick} />);
    expect(incrementTest).toBe(0);
  });
});
