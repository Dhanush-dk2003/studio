
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === "signin") {
      // Simulate successful login
      console.log("Signing in with:", values);
      login(); // This will redirect
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
    } else {
      // Simulate successful sign-up
      console.log("Signing up with:", values);
      login(); // For this mock, sign-up also logs in and redirects
       toast({
        title: "Signed Up",
        description: "Your account has been created successfully.",
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="items-center text-center">
        <ShieldCheck className="h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-2xl font-headline">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Sign in to access your reports."
            : "Sign up to start viewing reports."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Processing..." : (mode === "signin" ? "Sign In" : "Sign Up")}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
