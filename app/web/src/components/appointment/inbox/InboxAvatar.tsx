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
import Image from "next/image";

interface AvatarProps {
  avatarUrl: string;
  alt?: string;
  style?: CSS;
}

export const InboxAvatar = ({ avatarUrl, alt, style }: AvatarProps) => {
  const avatarStyle: CSS = {
    borderRadius: "100%",
    ...style,
  };
  return (
    <Image
      src={avatarUrl}
      alt={alt ?? `Avatar for ${avatarUrl}`}
      width={50}
      height={50}
      style={avatarStyle}
    />
  );
};
