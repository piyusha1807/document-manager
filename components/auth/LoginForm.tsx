"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginSchema } from "@/lib/schema";
import { useAuth } from "@/lib/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { loginAPI } from "@/lib/services/authService";

function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Focus first form field on mount
  useEffect(() => {
    const firstInput = formRef.current?.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const onSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoggingIn(true);

    try {
      const user = await loginAPI(email, password);
      login(user); // sets context

      // Announce success to screen readers
      toast.success("Login successful", {
        id: "login-success",
      });

      form.reset();

      router.push("/");
    } catch (err) {
      const errorMessage = (err as Error).message || "Failed to log in";
      toast.error(errorMessage, {
        id: "login-error",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2">
        <div>
          <h1
            className="text-2xl font-bold text-center mb-2"
            tabIndex={-1}
            id="login-form-heading"
          >
            Login to Document Manager
          </h1>
          <div
            className="text-sm text-muted-foreground text-center"
            tabIndex={-1}
            id="login-form-description"
          >
            Welcome back! Please login to continue
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 my-4"
          role="form"
          aria-labelledby="login-form-heading"
          aria-describedby="login-form-description"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hi@yourcompany.com"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.email}
                    {...field}
                  />
                </FormControl>
                <FormMessage aria-live="polite" />
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
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.password}
                    {...field}
                  />
                </FormControl>
                <FormMessage aria-live="polite" />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                {...form.register("remember")}
                aria-label="Remember login"
              />
              <Label
                htmlFor="remember"
                className="font-normal text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
            <Link
              href="/forgot-password"
              className="text-primary hover:underline focus:ring-2 focus:outline-none text-sm"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoggingIn}
            aria-busy={isLoggingIn}
            aria-disabled={isLoggingIn}
            className="w-full"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      <div className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary hover:underline focus:ring-2 focus:outline-none"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
