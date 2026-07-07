"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-card">
      <div className="text-center">
        <div className="admin-login-sun">☀</div>
        <h1 className="ss-page-title mt-4">
          Lumière <span>Admin</span>
        </h1>
        <p className="ss-news-lead mt-2">Sign in to manage bookings and services</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="avers.freelance@gmail.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <FieldError message={error} />
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
