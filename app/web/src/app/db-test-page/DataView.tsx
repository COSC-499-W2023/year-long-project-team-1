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
import * as React from "react";

export default function DataView() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/users`, {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((body) => setUsers(body.result.data));
  }, [setUsers]);

  return users.map((user: any) => (
    <div key={user.id}>
      username: {user.username}; firstname: {user.firstname}; lastname:{" "}
      {user.lastname}; email: {user.email}
    </div>
  ));
}
