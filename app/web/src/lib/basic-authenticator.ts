import { z } from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@lib/db";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
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
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials, req) {
    // validate entered credentials
    const parsedCredentials = loginSchema.safeParse(credentials);

    if (!parsedCredentials.success) {
      console.error("Invalid credentials");
      return null;
    }

    // get user from db
    const { email, password } = parsedCredentials.data;
    const user = await getUserByEmail(email);

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

    return {
      id: user.id.toString(),
      email: user.email,
    };
  },
});
