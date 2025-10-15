"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isValidEmail, isStrongPassword } from "@/lib/utils/validation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  console.log(token);
  console.log(email);

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email || !isValidEmail(email)) {
        setIsValid(false);
        return;
      }

      const res = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      const data = await res.json();
      setIsValid(data.valid);
    };

    validateToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validations
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include one letter and one number.",
      );
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword: password }),
    });

    setLoading(false);

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
    } else {
      setSuccess(true);
    }
  };

  // Conditional rendering
  if (isValid === null) return <p>Verifying reset link...</p>;
  if (!isValid) return <p>Reset link is invalid or expired.</p>;
  if (success)
    return (
      <p>
        Password reset successful! You may now <a href="/login">log in</a>.
      </p>
    );

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <h2 className="text-xl font-semibold">Reset Your Password</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded border p-2"
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        className="w-full rounded border p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 p-2 text-white disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
