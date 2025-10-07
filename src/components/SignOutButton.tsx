"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });

    if (!data?.url) {
      console.error("Something went wrong while logging out.");
      return;
    }

    router.push("/");
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
