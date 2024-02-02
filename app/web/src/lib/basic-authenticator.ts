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
import { z } from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@lib/db";
import bcrypt from "bcryptjs";
import { type User } from "next-auth";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export async function getUserByUsername(username: string) {
  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    return user;
  } catch (error) {
    console.error("Error getting user by username:", error);
    return null;
  }
}

export default CredentialsProvider({
  name: "Basic Auth",
  id: "basic",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials, req): Promise<User | null> {
    // validate entered credentials
    const parsedCredentials = loginSchema.safeParse(credentials);

    if (!parsedCredentials.success) {
      console.error("Invalid credentials");
      console.info(parsedCredentials);
      return null;
    }

    // get user from db
    const { username, password } = parsedCredentials.data;
    const user = await getUserByUsername(username);

    if (!user) {
      console.error("User not found");
      return null;
    }

    // compare password
    const passwordsMatch = await bcrypt.compare(password, user.password);

    // if password is correct, return user
    if (!passwordsMatch) {
      console.error("Invalid password");
      return null;
    }

    // User object needs `id` even when overriding in next.auth.d.ts
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.firstname,
      lastName: user.lastname,
      phone_number: "",
      email: user.email,
    };
  },
});
