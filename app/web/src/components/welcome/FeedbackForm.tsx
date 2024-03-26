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
"use client";
import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  TextArea,
  Alert,
} from "@patternfly/react-core";
import { CSS } from "@lib/utils";

const feedbackContainer: CSS = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-25%, 150%)",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};
const emailText: CSS = {
  fontWeight: "bolder",
  width: "400px",
};
const feedbackText: CSS = {
  fontWeight: "bolder",
  width: "400px",
};
const questionText: CSS = {
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "bolder",
  color: "#000000",
  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  fontSize: "32px",
  textAlign: "center",
  marginBottom: "1rem",
  marginLeft: "-1rem",
  transform: "translate(-120%, 125%)",
  width: "10rem",
};
const submitButtonContainer: CSS = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "1rem",
  transform: "translate(30%, -300%)",
};
const alertContainer: CSS = {
  width: "400px",
  marginTop: "0.25rem",
};
const FeedbackForm = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState(false);

  const handleEmailInput = (
    _: any,
    emailValue: React.SetStateAction<string>,
  ) => {
    setEmail(emailValue);
  };

  const handleFeedbackInput = (
    _: any,
    feedbackValue: React.SetStateAction<string>,
  ) => {
    setFeedback(feedbackValue);
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!email || !feedback) {
      setEmptyFieldError(true);
      return;
    }

    setEmptyFieldError(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/submitFeedback", {
        method: "POST",
        body: JSON.stringify({ email, feedback }),
      });

      if (!response.ok) {
        setFeedbackError(true);
        return;
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitting(false);
      setFeedbackError(true);
    }
    setEmail("");
    setFeedback("");
    setSubmitting(false);
    setFeedbackSubmitted(true);
  };

  return (
    <div style={feedbackContainer}>
      {emptyFieldError && !feedbackSubmitted && !feedbackError && (
        <Alert
          variant="danger"
          title="Email or Feedback is empty. Please fill in both fields."
          style={alertContainer}
        />
      )}
      {feedbackSubmitted && !feedbackError && (
        <Alert
          variant="success"
          title="Feedback submitted successfully. Our team will get back to you soon!"
          style={alertContainer}
        />
      )}
      {feedbackError && !feedbackSubmitted && (
        <Alert
          variant="danger"
          title="Failed to submit feedback. Please try again later."
          style={alertContainer}
        />
      )}
      <div style={questionText}>Have A Question?</div>
      <Form onSubmit={handleSubmit}>
        <FormGroup isRequired fieldId="simple-form-email-01">
          <TextInput
            style={emailText}
            isRequired
            placeholder="Email"
            type="email"
            id="simple-form-email-01"
            name="simple-form-email-01"
            value={email}
            onChange={handleEmailInput}
          />
        </FormGroup>
        <FormGroup isRequired fieldId="simple-form-feedback-01">
          <TextArea
            style={feedbackText}
            placeholder="Feedback"
            isRequired
            type="text"
            id="simple-form-feedback-01"
            name="simple-form-feedback-01"
            value={feedback}
            onChange={handleFeedbackInput}
            autoResize
          />
        </FormGroup>
        <div style={submitButtonContainer}>
          <Button variant="primary" type="submit" disabled={submitting}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FeedbackForm;
