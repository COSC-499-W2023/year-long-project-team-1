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
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackForm from "@components/welcome/FeedbackForm";
import "@testing-library/jest-dom";

describe("FeedbackForm Component", () => {
  it("renders input fields and submit button", () => {
    render(<FeedbackForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const feedbackInput = screen.getByPlaceholderText("Feedback");
    const submitButton = screen.getByText("Submit");

    expect(emailInput).toBeInTheDocument();
    expect(feedbackInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("displays error when submitting with empty fields", async () => {
    render(<FeedbackForm />);

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    const errorAlert = await screen.findByText(
      "Email or Feedback is empty. Please fill in both fields.",
    );

    expect(errorAlert).toBeInTheDocument();
  });
});
