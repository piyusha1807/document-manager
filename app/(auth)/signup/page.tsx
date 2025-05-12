import SignupForm from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup",
  description: "Signup to your account",
};

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignupForm />
    </main>
  );
}
