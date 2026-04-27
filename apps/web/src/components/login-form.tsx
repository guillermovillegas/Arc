"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-espresso-200/60 bg-ivory-50 shadow-[0_1px_60px_-20px_rgba(28,23,18,0.08)]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="font-serif text-3xl text-espresso-900">
                  Welcome back
                </h1>
                <p className="mt-1 text-body-sm text-espresso-400">
                  Sign in to your Arc account
                </p>
              </div>

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-espresso-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-espresso-200 bg-ivory-100 text-espresso-800 placeholder:text-espresso-300 focus-visible:ring-brass-500"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-espresso-600">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="ml-auto text-xs text-espresso-400 underline-offset-2 hover:text-brass-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-espresso-200 bg-ivory-100 text-espresso-800 focus-visible:ring-brass-500"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in\u2026" : "Sign In"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-espresso-200/60">
                <span className="relative z-10 bg-ivory-50 px-3 text-espresso-400">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full border-espresso-200 text-espresso-600 hover:bg-ivory-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Apple
                </Button>
                <Button variant="outline" className="w-full border-espresso-200 text-espresso-600 hover:bg-ivory-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <div className="text-center text-sm text-espresso-400">
                New to Arc?{" "}
                <Link
                  href="/register"
                  className="text-brass-600 underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>

          {/* Branded side panel */}
          <div className="relative hidden bg-espresso-800 md:block">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,147,90,0.25)_0%,transparent_60%)]" />
            <div className="relative flex h-full flex-col items-center justify-center p-10 text-center">
              <svg viewBox="0 0 120 120" className="h-20 w-20 text-brass-500" fill="none" aria-hidden="true">
                <path d="M10 100 C 10 30, 50 10, 60 10 C 70 10, 110 30, 110 100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="60" cy="100" r="3.5" fill="currentColor" />
              </svg>
              <p className="mt-8 font-serif text-3xl leading-tight text-ivory-100">
                Exceptional beauty,
                <br />
                <span className="italic text-brass-400">anywhere.</span>
              </p>
              <p className="mt-4 max-w-xs text-sm text-ivory-300">
                Your connection to vetted barbers, nail artists, lash techs, and
                makeup professionals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-espresso-400">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-espresso-600 underline-offset-4 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-espresso-600 underline-offset-4 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
