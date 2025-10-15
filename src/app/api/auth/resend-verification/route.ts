import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";
import { NextResponse } from "next/server";

import { sendEmailVerification } from "@/lib/utils/email";
import { isValidEmail, isStrongPassword } from "@/lib/utils/validation";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  if (!isValidEmail(email) || !isStrongPassword(password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const pendingRecords = await prisma.pendingSignup.findMany({
    where: { email },
  });

  let matched: { id: string } | null = null;

  for (const record of pendingRecords) {
    const isMatch = await compare(password, record.password);
    if (isMatch) {
      matched = { id: record.id };
      break;
    }
  }

  if (!matched)
    return NextResponse.json(
      { error: "No matching pending record found" },
      { status: 404 },
    );

  const newToken = randomBytes(32).toString("hex");

  const updated = await prisma.pendingSignup.update({
    where: { id: matched.id },
    data: {
      token: newToken,
      expires: addHours(new Date(), 1),
    },
  });

  await sendEmailVerification(updated.email, newToken);

  return NextResponse.json({ success: true });
}
