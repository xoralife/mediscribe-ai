"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleHome } from "@/lib/auth";

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(roleHome(user.role));
    }
  }, [ready, user, role, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-pine border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
}
