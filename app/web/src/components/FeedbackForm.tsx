"use client";
import React, { useState } from "react";
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  ActionGroup,
  Button,
} from "@patternfly/react-core";

const FeedbackForm = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    setSubmitting(true);

    try {
      const response = await fetch("/api/submitFeedback", {
        method: "POST",
        body: JSON.stringify({ email, feedback }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setEmail("");
      setFeedback("");
      setSubmitting(false);

      const data = await response.json();
      console.log(data);
      console.log(email);
      console.log(feedback);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup label="Email" isRequired fieldId="simple-form-email-01">
        <TextInput
          isRequired
          type="email"
          id="simple-form-email-01"
          name="simple-form-email-01"
          value={email}
          onChange={handleEmailInput}
        />
      </FormGroup>
      <FormGroup label="Feedback" isRequired fieldId="simple-form-feedback-01">
        <TextInput
          isRequired
          type="text"
          id="simple-form-feedback-01"
          name="simple-form-feedback-01"
          value={feedback}
          onChange={handleFeedbackInput}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" type="submit" disabled={submitting}>
          Submit
        </Button>
        <Button variant="link">Cancel</Button>
      </ActionGroup>
    </Form>
  );
};

export default FeedbackForm;
