"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="space-y-6">
      <section className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
        <p className="mt-2 text-gray-600">
          This is your document management dashboard. Here you can see a quick
          overview of your documents and activities.
        </p>
      </section>
    </main>
  );
}
