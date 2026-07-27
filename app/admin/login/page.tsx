import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
            Shiatsu Spa Admin
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to manage your website content.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
