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
import Footer from "@components/layout/Footer";

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
    expect(
      screen.getByRole("link", { name: "GitHub logo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "YouTube logo" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "mail icon" })).toBeInTheDocument();
  });
});
