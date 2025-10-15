import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
  const { token, email } = await req.json();

  if (!token || !email) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ valid: false });
  }

  const record = await prisma.forgotPasswordToken.findFirst({
    where: {
      userId: user.id,
      used: false,
      expires: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" }, // Just in case multiple tokens exist
  });

  if (!record) {
    return NextResponse.json({ valid: false });
  }

  const isMatch = await compare(token, record.token);
  if (!isMatch) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
