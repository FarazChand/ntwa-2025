import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { isValidEmail, isStrongPassword } from "@/lib/utils/validation";

export async function POST(req: NextRequest) {
  const { token, email, newPassword } = await req.json();

  // ✅ Input validation
  if (!token || !email || !newPassword) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 },
    );
  }

  if (!isStrongPassword(newPassword)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters long and include at least one letter and one number.",
      },
      { status: 400 },
    );
  }

  // ✅ Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  }

  // ✅ Find valid reset token
  const record = await prisma.forgotPasswordToken.findFirst({
    where: {
      userId: user.id,
      used: false,
      expires: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record || !(await compare(token, record.token))) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 },
    );
  }

  // ✅ Hash and update password
  const hashedPassword = await hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  // ✅ Mark token as used
  await prisma.forgotPasswordToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  return NextResponse.json({ message: "Password reset successful." });
}
