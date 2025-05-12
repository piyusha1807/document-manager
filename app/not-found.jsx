import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404: Page Not Found - Labeliy",
  description:
    "The page you're looking for cannot be found. Return to Labeliy's homepage to continue creating professional labels.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] my-20 px-4 text-center">
      <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Return Home
          </Link>
        </Button>
      </div>
      <div className="mt-20 space-y-4">
        <p className="text-sm text-muted-foreground">
          Popular pages you might be looking for:
        </p>
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="text-primary hover:underline">
            Dashboard
          </Link>
          <Link
            href="/document-management"
            className="text-primary hover:underline"
          >
            Document Management
          </Link>
        </nav>
      </div>
    </div>
  );
}
