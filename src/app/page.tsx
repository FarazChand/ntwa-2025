"use client";

import { useSession } from "next-auth/react";
import SignOutButton from "@/components/SignOutButton";
import SignInButton from "@/components/SignInButton";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="color-background">
      {/* Conditionally rendered welcome message */}
      {status === "loading" ? (
        <p>Loading session...</p>
      ) : session ? (
        <>
          <h1 className="color-primary text-lg">
            Welcome back, {session.user?.email}!
          </h1>
          <SignOutButton />
        </>
      ) : (
        <>
          <h1 className="color-secondary text-lg">Welcome, guest!</h1>
          <SignInButton />
        </>
      )}

      <h1 className="color-primary flex text-lg">Hello world!</h1>
      <h1 className="color-secondary flex text-lg">Hello world!</h1>
      <h1 className="color-accent text-lg">Hello world!</h1>
      <h1 className="bg-primary text-lg">Hello world!</h1>
      <h1 className="bg-secondary text-lg">Hello world!</h1>
      <h1 className="bg-accent text-lg">Hello world!</h1>
      <h1 className="color-success text-lg">Hello world!</h1>
      <h1 className="color-danger text-lg">Hello world!</h1>
    </main>
  );
}
