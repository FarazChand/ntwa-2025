"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
    } else {
      setPassword("");
      // For security, it's best practice not to reveal whether the email is valid to prevent attackers enumerating user accounts. → Instead, always respond with a neutral message like "If an account exists, we'll send an email shortly."
      setError(
        "Invalid credentials. Either your password is incorrect OR you haven't verified the account.",
      );
    }
  }

  return (
    <div>
      <h3 className={error ? "color-danger" : "color-primary"}>
        {error ? error : "Login below:"}
      </h3>
      <form onSubmit={handleLogin} className="color-accent space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
