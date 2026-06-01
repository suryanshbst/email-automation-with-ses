"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";

// Validation schema for the server
const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  // 1. Validate the incoming data
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;

  // 2. Check if the user already exists in Postgres
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // 3. Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Save the new user to the database
  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 5. Generate a Verification Token
  // Using crypto for a secure random string
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  await db.verificationToken.create({
    data: {
      email: newUser.email,
      token,
      expires,
    },
  });

  // 6. Trigger AWS SES to send the email
  try {
    await sendVerificationEmail(newUser.email, token);
    return {
      success: "Registration successful! Please check your email to verify.",
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send verification email. Please try again." };
  }
}
