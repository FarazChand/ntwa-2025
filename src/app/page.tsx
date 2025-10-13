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
          <h1 className="text-lg text-primary">
            Welcome back, {session.user?.email}!
          </h1>
          <SignOutButton />
        </>
      ) : (
        <>
          <h1 className="text-lg text-secondary">Welcome, guest!</h1>
          <SignInButton />
        </>
      )}

      <h1 className="flex text-lg text-primary">Hello world!</h1>
      <h1 className="flex text-lg text-secondary">Hello world!</h1>
      <h1 className="text-lg text-accent">Hello world!</h1>
      <h1 className="text-lg text-background">Hello world!</h1>
      <h1 className="text-lg text-foreground">Hello world!</h1>
      <h1 className="text-lg text-muted">Hello world!</h1>
      <h1 className="text-lg text-border">Hello world!</h1>
      <h1 className="text-lg text-input">Hello world!</h1>
      <h1 className="text-lg text-danger">Hello world!</h1>
    </main>
  );
}
