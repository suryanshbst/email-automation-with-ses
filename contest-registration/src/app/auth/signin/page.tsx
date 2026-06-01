import { SigninForm } from "@/components/auth/signin-form";
import Link from "next/link";
import { Suspense } from "react";

export default function SigninPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-6">
      {}
      <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
        <SigninForm />
      </Suspense>

      <p className="text-sm text-zinc-400">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-white hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
