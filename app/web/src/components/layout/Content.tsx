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

const contentStyles: CSS = {
  width: "100%",
  padding: "1rem 3.5vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "0.5rem",
  position: "relative",
};

interface ContentProps {
  style?: CSS;
  children?: React.ReactNode;
}

export default async function Content({ style, children }: ContentProps) {
  return (
    <div style={{ ...contentStyles, ...style }} className="page-content">
      {children}
    </div>
  );
}
