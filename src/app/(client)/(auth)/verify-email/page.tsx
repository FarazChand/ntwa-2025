"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  let alreadyCalled = useRef(false); // for when strict mode double re-renders in dev. Token is invalid on second rerender

  useEffect(() => {
    // Wait until the token actually exists before doing anything
    if (!token) return;

    if (alreadyCalled.current) return;
    alreadyCalled.current = true;

    const verifyEmail = async () => {
      const res = await fetch(`/api/auth/verify-email?token=${token}`);

      if (res.ok) {
        setStatus("success");
        // Optionally redirect after delay
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  if (status === "loading") {
    return <p>Verifying email...</p>;
  }
  if (status === "success") {
    return <p>Email verified! Redirecting to login...</p>;
  }

  if (status === "error") {
    return <p>Invalid or expired verification link.</p>;
  }
}
