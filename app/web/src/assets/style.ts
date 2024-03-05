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

import { CSS, Stylesheet } from "@lib/utils";

export const style: Stylesheet = {
  card: {},
  actionList: {
    display: "flex",
    flexDirection: "row" as CSS["flexDirection"],
    justifyContent: "center",
  },
  cardBody: {},
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    backgroundColor: "var(--pf-v5-global--primary-color--100)",
    textAlign: "center",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0",
    position: "sticky",
    top: "0",
    zIndex: "1000",
  },
  texth1: {
    fontSize: "50px",
    fontWeight: "bolder",
    color: "var(--pf-v5-global--primary-color--500)",
    margin: "0.5rem 0",
  },
  texth2: {
    fontSize: "20px",
    fontWeight: "bolder",
    color: "var(--pf-v5-global--primary-color--200)",
    margin: "0.5rem 0",
    marginBottom: "3rem",
  },
};

export default style;
