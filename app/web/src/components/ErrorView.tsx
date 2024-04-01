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
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
  StackItem,
  Stack,
  EmptyStateFooter,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import * as React from "react";

export interface ErrorViewProps {
  title: React.ReactNode;
  message: React.ReactNode;
  retryButtonMessage?: string;
  retry?: () => void;
}

export const ErrorView = ({
  title,
  message,
  retryButtonMessage = "Retry",
  retry,
}: ErrorViewProps) => {
  return (
    <>
      <EmptyState>
        <EmptyStateIcon icon={ExclamationCircleIcon} color={"#a30000"} />
        <Title headingLevel="h4" size="lg">
          {title}
        </Title>
        <EmptyStateBody>{message}</EmptyStateBody>
        <EmptyStateFooter>
          {retry ? (
            <StackItem>
              <Button variant="link" onClick={retry}>
                {retryButtonMessage}
              </Button>
            </StackItem>
          ) : null}
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};
