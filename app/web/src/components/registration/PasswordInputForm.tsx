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
import {
  HelperText,
  FormGroup,
  InputGroup,
  InputGroupItem,
  TextInput,
  FormHelperText,
  HelperTextItem,
  Popover,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  HelpIcon,
} from "@patternfly/react-icons";

interface PasswordStrengthDemoProps {
  password: string;
  handlePasswordInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ruleLength: string;
  ruleNumber: string;
  ruleSpecial: string;
  ruleUpper: string;
  ruleLower: string;
  passStrength: {
    variant: string;
    icon: JSX.Element;
    text: string;
  };
  passwordHidden: boolean;
  setPasswordHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordStrengthDemo: React.FC<PasswordStrengthDemoProps> = ({
  password,
  handlePasswordInput,
  ruleLength,
  ruleNumber,
  ruleSpecial,
  ruleUpper,
  ruleLower,
  passStrength,
  passwordHidden,
  setPasswordHidden,
}) => {
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
          <button
            type="button"
            onClick={() => setPasswordHidden(!passwordHidden)}
            aria-label={passwordHidden ? "Show password" : "Hide password"}
          >
            {passwordHidden ? "Show" : "Hide"}
          </button>
        </InputGroupItem>
      </InputGroup>
      <FormHelperText>
        <HelperText
          component="ul"
          aria-live="polite"
          id="password-field-helper"
        >
          <li>Must be at least 8 characters</li>
          <li>Must contain at least 1 number</li>
          <li>Must contain at least 1 special character</li>
          <li>Must include at least 1 uppercase letter</li>
          <li>Must include at least 1 lowercase letter</li>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default PasswordStrengthDemo;
