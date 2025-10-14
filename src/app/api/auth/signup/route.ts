import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

// import { randomUUID } from "crypto";

import { sendEmailVerification } from "@/lib/utils/email"; // Create this utility
import { isValidEmail, isStrongPassword } from "@/lib/utils/validation";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    // Input Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json({ error: "Password too weak" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await hash(password, 10);

    // Creating email verification token and url
    const token = randomBytes(32).toString("hex");

    await prisma.pendingSignup.create({
      data: {
        email,
        password: hashedPassword,
        token,
        expires: addHours(new Date(), 1),
      },
    });

    await sendEmailVerification(email, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Signup Error: ", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
