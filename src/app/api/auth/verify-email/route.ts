import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token missing" }, { status: 400 });
  }

  const pending = await prisma.pendingSignup.findUnique({
    where: { token },
  });

  if (!pending || pending.expires < new Date()) {
    return NextResponse.json(
      // Would have to send token back here if you want to update the new token later (after user requests new token when expired)
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  await prisma.user.create({
    data: {
      email: pending.email,
      password: pending.password,
    },
  });

  await prisma.pendingSignup.deleteMany({ where: { email: pending.email } });

  return NextResponse.json({ success: true });
}
