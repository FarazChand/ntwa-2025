import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { addHours, isBefore } from "date-fns";

import { sendPasswordResetEmail } from "@/lib/utils/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
    },
  });

  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = await hash(rawToken, 10);

    const expires = addHours(new Date(), 1);

    const createdToken = await prisma.forgotPasswordToken.create({
      data: {
        token: hashedToken,
        expires,
        user: { connect: { id: user.id } },
      },
    });

    // console.log("heres a console log");
    // console.log("Token created:", createdToken);

    await sendPasswordResetEmail(user.email, rawToken);
  }

  return NextResponse.json({
    message: "If an account with that email exists, we sent a reset link.",
  });
}
