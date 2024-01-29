import { z } from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@lib/db";
import bcrypt from "bcryptjs";

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
  async authorize(credentials, req) {
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

    console.log("User logged in");
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
    };
  },
});
