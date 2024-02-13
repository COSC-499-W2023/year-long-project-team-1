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
import { Card, CardBody, Flex, FlexItem, Title } from "@patternfly/react-core";
import Link from "next/link";
import { Session } from "next-auth";

interface AppointmentCardProps {
  user: Session["user"];
}

const style: Record<string, React.CSSProperties> = {
  card: {
    position: "fixed",
    bottom: 0,
    left: 0,
    zIndex: 3,
    overflow: "auto",
    padding: "1rem",
    width: "30%",
    minHeight: "20vh",
  },
  userData: {
    marginTop: "1rem",
    marginBottom: "1rem",
    width: "100%",
  },
  link: {
    alignItems: "flex-end",
    gap: "1rem",
  },
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ user }) => {
  return (
    <Card style={style.card}>
      <CardBody>
        <Flex
          direction={{ default: "column" }}
          grow={{ default: "grow" }}
          style={style.userData}
        >
          <FlexItem>
            <Title headingLevel="h2">
              {user.firstName}&nbsp;{user.lastName}
            </Title>
          </FlexItem>
          <FlexItem style={style.link}>
            <Link href="/user/update">Edit your information</Link>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};
