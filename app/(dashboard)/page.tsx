"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <main className="space-y-6 ">
      <section className="p-6">
        <h2 className="text-xl font-semibold">👋 Welcome, {user?.name}!</h2>
        <p className="mt-2 text-gray-600">
          This is your document management dashboard. Here you can see a quick
          overview of your documents and activities. 📄 ✨
        </p>
      </section>
    </main>
  );
}
