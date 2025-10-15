"use client";

import { useState } from "react";
import { isValidEmail } from "@/lib/utils/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // We show success message regardless of status to protect privacy
      setSubmitted(true);
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto mt-10 max-w-md">
        <h2 className="mb-4 text-xl font-semibold">Check Your Email</h2>
        <p>
          If an account with that email exists, we’ve sent you a password reset
          link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Forgot Your Password?</h2>
      <p className="text-sm text-gray-600">
        Enter your email and we’ll send you a link to reset your password.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
        className="w-full rounded border p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
