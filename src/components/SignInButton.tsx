"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn(undefined, { callbackUrl: "/" })} // redirects back home
      className="text-sm font-medium hover:underline"
    >
      Sign In
    </button>
  );
}
