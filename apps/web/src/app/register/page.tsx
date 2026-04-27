import { Suspense } from "react";
import { RegisterForm } from "@/components/register-form";

function RegisterContent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-ivory-100 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center bg-ivory-100" />}>
      <RegisterContent />
    </Suspense>
  );
}
