"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const initialRole = searchParams.get("role") === "provider" ? "PROVIDER" : "CLIENT";
  const [role, setRole] = useState<"CLIENT" | "PROVIDER">(initialRole);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-espresso-200/60 bg-ivory-50 shadow-[0_1px_60px_-20px_rgba(28,23,18,0.08)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Branded side panel */}
          <div className="relative hidden bg-espresso-800 md:block">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(184,147,90,0.25)_0%,transparent_60%)]" />
            <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
              <svg viewBox="0 0 120 120" className="h-20 w-20 text-brass-500" fill="none" aria-hidden="true">
                <path d="M10 100 C 10 30, 50 10, 60 10 C 70 10, 110 30, 110 100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="60" cy="100" r="3.5" fill="currentColor" />
              </svg>
              <p className="mt-8 font-serif text-3xl leading-tight text-ivory-100">
                Your craft,
                <br />
                <span className="italic text-brass-400">amplified.</span>
              </p>
              <p className="mt-4 max-w-xs text-sm text-ivory-300">
                Join a community of master professionals. Zero monthly fees.
                Build the business your craft deserves.
              </p>
            </div>
          </div>

          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <h1 className="font-serif text-3xl text-espresso-900">
                  Create your account
                </h1>
                <p className="mt-1 text-body-sm text-espresso-400">
                  Begin your journey with Arc
                </p>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Role toggle */}
              <div className="grid grid-cols-2 gap-0 border border-espresso-200/60">
                {(["CLIENT", "PROVIDER"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "py-3 text-sm font-medium transition-colors",
                      role === r
                        ? "bg-espresso-800 text-ivory-100"
                        : "bg-ivory-100 text-espresso-400 hover:text-espresso-700",
                    )}
                  >
                    {r === "CLIENT" ? "Client" : "Professional"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-espresso-600">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className="border-espresso-200 bg-ivory-100 text-espresso-800 focus-visible:ring-brass-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-espresso-600">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="border-espresso-200 bg-ivory-100 text-espresso-800 focus-visible:ring-brass-500"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-espresso-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="border-espresso-200 bg-ivory-100 text-espresso-800 placeholder:text-espresso-300 focus-visible:ring-brass-500"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-espresso-600">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8+ characters"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="border-espresso-200 bg-ivory-100 text-espresso-800 placeholder:text-espresso-300 focus-visible:ring-brass-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating\u2026" : "Create Account"}
              </Button>

              <div className="text-center text-sm text-espresso-400">
                Already on Arc?{" "}
                <Link
                  href="/login"
                  className="text-brass-600 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
