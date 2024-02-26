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
import { CSS } from "@lib/utils";
import { ConversationList } from "./ConversationList";
import { getLoggedInUser } from "@app/actions";
import { ConversationViewer } from "./ConversationViewer";
import { UserRole } from "@lib/userRole";
import pfAvatar from "@assets/pf_avatar.svg";
import { User } from "next-auth";
import UploadVideoForm from "@components/upload/UploadVideoForm";

const inboxStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "100%",
  width: "100%",
  border: "1px solid #000",
};

// TODO: replace with actual user
const testUserWith: User = {
  id: "test-user-id",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@privacypal.com",
};

export const AppointmentInbox = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    return <div style={inboxStyle}>User not logged in.</div>;
  }

  return (
    <div style={inboxStyle}>
      <ConversationList user={user} />
      <ConversationViewer withUser={testUserWith}>
        <UploadVideoForm />
      </ConversationViewer>
    </div>
  );
};
