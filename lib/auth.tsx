"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/token";
import type { AuthSession, User } from "@/lib/types";

interface AuthCtx {
  user: User | null;
  session: AuthSession | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.restoreSession().then((s) => {
      setSession(s);
      setReady(true);
    }).catch(() => {
      setReady(true);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const s = await api.login({ email, password });
    // Pending doctors don't get a persisted session — the login page shows the
    // pending popup instead of redirecting them anywhere.
    if (s.user.role !== "pending_doctor") {
      setSession(s);
    }
    return s;
  };

  const logout = () => {
    api.logout();
    setSession(null);
    router.push("/");
  };

  const updateUser = (user: User) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user };
      saveSession(next);
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, ready, login, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

export function roleHome(role?: string): string {
  switch (role) {
    case "admin": return "/admin";
    case "doctor": return "/doctor";
    case "patient": return "/patient";
    case "pending_doctor": return "/pending";
    default: return "/login";
  }
}
