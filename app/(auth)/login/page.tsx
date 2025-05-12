import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

const TestCredentials = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
      <h2 className="text-sm font-medium text-blue-800 mb-2">
        Test Credentials
      </h2>
      <div className="space-y-3">
        <div>
          <div className="text-xs font-semibold text-blue-700 mb-1">
            Admin User:
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Email:</div>
            <div className="font-mono">admin@example.com</div>
            <div className="text-gray-600">Password:</div>
            <div className="font-mono">password</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-blue-700 mb-1">
            Editor User:
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Email:</div>
            <div className="font-mono">editor@example.com</div>
            <div className="text-gray-600">Password:</div>
            <div className="font-mono">password</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-blue-700 mb-1">
            Viewer User:
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Email:</div>
            <div className="font-mono">viewer@example.com</div>
            <div className="text-gray-600">Password:</div>
            <div className="font-mono">password</div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        You can use any of these credentials to test the application with
        different permission levels.
      </p>
    </div>
  );
};

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <LoginForm />
      <TestCredentials />
    </main>
  );
}
