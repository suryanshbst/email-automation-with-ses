"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser } from "@/actions/register";
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

// Re-use the schema on the client for instant feedback
const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

export function SignupForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      registerUser(values).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
      });
    });
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl tracking-tight">
          Join the Arena
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Create an account to register for the upcoming coding contest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="John Doe"
                        className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
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
              Create an account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
