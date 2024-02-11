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
