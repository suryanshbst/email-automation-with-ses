"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  // Check if they just got redirected from the email verification
  const isVerified = searchParams.get("verified") === "true";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsPending(true);

    try {
      // Use NextAuth v4's signIn function
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        toast.error(response.error);
      } else if (response?.ok) {
        toast.success("Welcome back!");
        router.push("/"); // Redirect to the main contest registration page!
        router.refresh(); // Refresh to update NextAuth session state
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">
          Access the Arena
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Sign in to your account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerified && (
          <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-400 border border-green-500/20">
            Email successfully verified! You can now log in.
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                        className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              {isPending ? "Authenticating..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
