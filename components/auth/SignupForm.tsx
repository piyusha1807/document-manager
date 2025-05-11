"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { signupSchema } from "@/lib/schema";
import { useAuth } from "@/lib/context/AuthContext";
import { signupAPI } from "@/lib/services/authService";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Focus first form field on mount
  useEffect(() => {
    const firstInput = formRef.current?.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const onSubmit = async (data: SignupFormData) => {
    setIsSigningUp(true);

    try {
      const user = await signupAPI(data);
      login(user);

      toast.success("Account created successfully!");

      form.reset();

      router.push("/");
    } catch (err) {
      toast.error((err as Error).message || "Failed to sign up");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2">
        <div>
          <h1
            className="text-2xl font-bold text-center mb-2"
            tabIndex={-1}
            id="signup-form-heading"
          >
            Create your account
          </h1>
          <div
            className="text-sm text-muted-foreground text-center"
            id="signup-form-description"
          >
            Welcome! Please fill in the details to get started
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 my-4"
          ref={formRef}
          role="form"
          aria-labelledby="signup-form-heading"
          aria-describedby="signup-form-description"
          noValidate
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...field}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.name}
                  />
                </FormControl>
                <FormMessage id="name-error" aria-live="polite" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="hi@yourcompany.com"
                    {...field}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.email}
                  />
                </FormControl>
                <FormMessage id="email-error" aria-live="polite" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.password}
                  />
                </FormControl>
                <FormMessage id="password-error" aria-live="polite" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.confirmPassword}
                  />
                </FormControl>
                <FormMessage id="confirmPassword-error" aria-live="polite" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSigningUp}
            aria-busy={isSigningUp}
            aria-disabled={isSigningUp}
            className="w-full"
          >
            {isSigningUp ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>

      <div className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
