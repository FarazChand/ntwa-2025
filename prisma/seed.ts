import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("password123", 10); // hash your password
  await prisma.user.create({
    data: {
      email: "test@example.com",
      password: hashedPassword,
    },
  });
  console.log("Mock user created!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
