import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // 1. Extract the token from the URL
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  // 2. Find the token in the database
  const existingToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  // 3. Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return NextResponse.json({ error: "Token has expired" }, { status: 400 });
  }

  // 4. Find the user associated with this token's email
  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return NextResponse.json(
      { error: "Email does not exist" },
      { status: 400 },
    );
  }

  // 5. Mark the user as verified and delete the token
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email, // Edge case: if they change their email later
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // 6. Redirect them to the login page with a success flag
  return NextResponse.redirect(new URL("/auth/signin?verified=true", req.url));
}
