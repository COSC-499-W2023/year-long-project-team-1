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

import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
} from "@patternfly/react-core";
import { MapMarkedAltIcon } from "@patternfly/react-icons";

export default function NotFound() {
  const handleClickHome = () => {
    window.location.href = "/";
  };

  return (
    <EmptyState>
      <EmptyStateHeader
        titleText="404: Page not found"
        headingLevel="h4"
        icon={<EmptyStateIcon icon={MapMarkedAltIcon} />}
      />
      <EmptyStateBody>
        Unfortunately, we couldn't find that page.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button onClick={handleClickHome}>{"Return home"}</Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
}
