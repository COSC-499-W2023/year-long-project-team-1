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
import { Avatar } from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";

interface CustomAvatarProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: any;
}
export default function CustomAvatar({
  firstName,
  lastName,
  size,
  className,
  style,
}: CustomAvatarProps) {
  const avatarLink =
    firstName && lastName
      ? `https://ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`
      : avatarImg.src;
  return (
    <Avatar
      src={avatarLink}
      alt="Profile picture"
      size={size}
      className={className}
      style={style}
    />
  );
}
