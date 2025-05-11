import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm />
    </main>
  );
}
