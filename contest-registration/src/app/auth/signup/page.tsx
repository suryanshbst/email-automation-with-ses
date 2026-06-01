import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-6">
      <SignupForm />
      <p className="text-sm text-zinc-400">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-white hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
