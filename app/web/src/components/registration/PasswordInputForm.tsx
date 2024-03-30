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
import React from "react";
import {
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  Popover,
  HelperTextItem,
  TextInput,
  InputGroup,
  InputGroupItem,
  Button,
} from "@patternfly/react-core";
import HelpIcon from "@patternfly/react-icons/dist/esm/icons/help-icon";
import ExclamationCircleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon";
import ExclamationTriangleIcon from "@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon";
import CheckCircleIcon from "@patternfly/react-icons/dist/esm/icons/check-circle-icon";
import EyeIcon from "@patternfly/react-icons/dist/esm/icons/eye-icon";
import EyeSlashIcon from "@patternfly/react-icons/dist/esm/icons/eye-slash-icon";

interface PasswordStrengthProps {
  initialValue: string;
  onChange: (v: string) => void;
}

export const PasswordStrengthDemo: React.FunctionComponent<
  PasswordStrengthProps
> = ({ initialValue, onChange }: PasswordStrengthProps) => {
  type HelperTextItemVariant =
    | "default"
    | "indeterminate"
    | "warning"
    | "success"
    | "error";

  interface PassStrength {
    variant: HelperTextItemVariant;
    icon: JSX.Element;
    text: string;
  }

  const [password, setPassword] = React.useState("");
  const [ruleLength, setRuleLength] =
    React.useState<HelperTextItemVariant>("indeterminate");
  const [ruleNumber, setRuleNumber] =
    React.useState<HelperTextItemVariant>("indeterminate");
  const [ruleSpecial, setRuleSpecial] =
    React.useState<HelperTextItemVariant>("indeterminate");
  const [ruleUpper, setRuleUpper] =
    React.useState<HelperTextItemVariant>("indeterminate");
  const [ruleLower, setRuleLower] =
    React.useState<HelperTextItemVariant>("indeterminate");
  const [passStrength, setPassStrength] = React.useState<PassStrength>({
    variant: "error",
    icon: <ExclamationCircleIcon />,
    text: "Weak",
  });
  const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);

  const handlePasswordInput = (_event: any, password: string) => {
    setPassword(password);
    validate(password);
    onChange(password);
  };

  const validate = (password: string) => {
    if (password === "") {
      setRuleLength("indeterminate");
      setRuleNumber("indeterminate");
      setRuleSpecial("indeterminate");
      setRuleUpper("indeterminate");
      setRuleLower("indeterminate");
      return;
    }
    if (password.length < 8) {
      setRuleLength("error");
    } else {
      setRuleLength("success");
    }

    let ruleNum = 0,
      ruleSpecial = 0,
      ruleUpper = 0,
      ruleLower = 0;
    let strCount = 0;
    //contains at least 1 lowercase letter
    if (/[a-z]/g.test(password)) {
      const lowercaseMatches = password.match(/[a-z]/g);
      if (lowercaseMatches !== null) {
        strCount += lowercaseMatches.length;
      }
      ruleLower++;
    }
    //contains at least 1 uppercase letter
    if (/[A-Z]/g.test(password)) {
      const uppercaseMatches = password.match(/[A-Z]/g);
      if (uppercaseMatches !== null) {
        strCount += uppercaseMatches.length;
      }
      ruleUpper++;
    }

    if (/\d/g.test(password)) {
      const numberMatches = password.match(/\d/g);
      if (numberMatches !== null) {
        strCount += numberMatches.length;
      }
      ruleNum++;
    }

    if (/\W/g.test(password)) {
      const specialMatches = password.match(/\W/g);
      if (specialMatches !== null) {
        strCount += specialMatches.length;
      }
      ruleSpecial++;
    }
    if (ruleNum == 0) {
      setRuleNumber("error");
    } else {
      setRuleNumber("success");
    }
    if (ruleSpecial == 0) {
      setRuleSpecial("error");
    } else {
      setRuleSpecial("success");
    }
    if (ruleUpper == 0) {
      setRuleUpper("error");
    } else {
      setRuleUpper("success");
    }
    if (ruleLower == 0) {
      setRuleLower("error");
    } else {
      setRuleLower("success");
    }

    if (strCount < 3) {
      setPassStrength({
        variant: "error",
        icon: <ExclamationCircleIcon />,
        text: "Weak",
      });
    } else if (strCount < 5) {
      setPassStrength({
        variant: "warning",
        icon: <ExclamationTriangleIcon />,
        text: "Medium",
      });
    } else {
      setPassStrength({
        variant: "success",
        icon: <CheckCircleIcon />,
        text: "Strong",
      });
    }
  };

  const iconPopover = (
    <Popover
      headerContent={<div>Password Requirements</div>}
      bodyContent={
        <div>
          <p style={{ color: "grey" }}>Password minimum length</p>
          <p>8 character(s).</p>
          <br />
          <p style={{ color: "grey" }}>Password requirements</p>
          <p>Contains at least 1 number.</p>
          <p>Contains at least 1 special character.</p>
          <p>Contains at least 1 uppercase letter.</p>
          <p>Contains at least 1 lowercase letter.</p>
        </div>
      }
    >
      <button
        type="button"
        aria-label="More info for name field"
        onClick={(e) => e.preventDefault()}
        aria-describedby="password-field"
        className="pf-v5-c-form__group-label-help"
      >
        <HelpIcon />
      </button>
    </Popover>
  );

  const passStrLabel = (
    <HelperText>
      <HelperTextItem variant={passStrength.variant} icon={passStrength.icon}>
        {passStrength.text}
      </HelperTextItem>
    </HelperText>
  );

  return (
    <Form>
      <FormGroup
        label="New Password"
        labelIcon={iconPopover}
        isRequired
        fieldId="password-field"
        {...(ruleLength === "success" &&
          ruleNumber === "success" &&
          ruleSpecial === "success" &&
          ruleLower === "success" &&
          ruleUpper === "success" && {
            labelInfo: passStrLabel,
          })}
      >
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              isRequired
              type={passwordHidden ? "password" : "text"}
              id="password-field"
              name="password-field"
              aria-describedby="password-field-helper"
              aria-invalid={
                ruleLength === "error" ||
                ruleNumber === "error" ||
                ruleSpecial === "error" ||
                ruleUpper === "error" ||
                ruleLower === "error"
              }
              value={password}
              onChange={handlePasswordInput}
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant="control"
              onClick={() => setPasswordHidden(!passwordHidden)}
              aria-label={passwordHidden ? "Show password" : "Hide password"}
            >
              {passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
            </Button>
          </InputGroupItem>
        </InputGroup>
        <FormHelperText>
          <HelperText
            component="ul"
            aria-live="polite"
            id="password-field-helper"
          >
            <HelperTextItem isDynamic variant={ruleLength} component="li">
              Must be at least 8 characters
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleNumber} component="li">
              Must contain at least 1 number
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleSpecial} component="li">
              Must contain at least 1 special character{" "}
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleUpper} component="li">
              Must include at least 1 uppercase letter{" "}
            </HelperTextItem>
            <HelperTextItem isDynamic variant={ruleLower} component="li">
              Must include at least 1 lowercase letter{" "}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
    </Form>
  );
};
