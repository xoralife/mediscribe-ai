"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui";
import { demoAccounts } from "@/lib/api";
import { roleHome, useAuth } from "@/lib/auth";
import type { AuthSession } from "@/lib/types";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.6z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5.1l-.1 0-3.7 2.8-.1.1C3.3 21.3 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.2A7.3 7.3 0 014.9 12c0-.8.1-1.5.2-2.2l0-.1-3.7-2.9-.1.1A11.9 11.9 0 000 12c0 1.9.5 3.8 1.3 5.4l3.8-3.2z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3 .8 3.7 1.4l2.7-2.6C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.8 3c1-3 3.7-4.9 6.9-4.9z"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#F25022" d="M1.5 1.5h10v10h-10z" />
      <path fill="#7FBA00" d="M12.5 1.5h10v10h-10z" />
      <path fill="#00A4EF" d="M1.5 12.5h10v10h-10z" />
      <path fill="#FFB900" d="M12.5 12.5h10v10h-10z" />
    </svg>
  );
}

function AuthShell({ children, aside }: { children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — golden illustration (60%) */}
      <aside className="relative hidden w-[60%] overflow-hidden bg-[#0b1020] lg:block">
        {aside}
      </aside>

      {/* Right — form (40%) */}
      <div className="flex flex-1 flex-col bg-white">
        <div className="px-6 py-6 sm:px-10">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const router = useRouter();
  const { user, ready, login } = useAuth();
  const [email, setEmail] = useState("dr.rohan@mediscribe.ai");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingUser, setPendingUser] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) router.replace(roleHome(user.role));
  }, [ready, user, router]);

  const afterLogin = (s: AuthSession) => {
    if (s.user.role === "pending_doctor") {
      // Keep the login form visible; show the pending permission popup instead of a dashboard.
      setPendingUser(s.user.name);
      return;
    }
    router.replace(roleHome(s.user.role));
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const s = await login(email, password);
      afterLogin(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const quickLogin = async (demo: (typeof demoAccounts)[number]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
    setBusy(true);
    try {
      const s = await login(demo.email, demo.password);
      afterLogin(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      aside={
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doctor-login.jpg"
            alt="Doctor"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1020]/60 via-[#0b1020]/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0b1020]/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
              MediScribe AI
            </span>
            <p className="text-2xl font-semibold leading-snug text-white">
              “It drafts the note while I still listen to my patient.”
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/70">
              Dr. Rohan Deshpande · Internal Medicine
            </p>
          </div>
        </div>
      }
    >
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Welcome back to MediScribe!
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Sign in with your account or use a demo account below.
      </p>

      {/* Social buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-ink transition-all hover:border-brand hover:text-brand"
          onClick={() => setError("Social sign-in is disabled for the demo — use your email or a demo account.")}
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-ink transition-all hover:border-brand hover:text-brand"
          onClick={() => setError("Social sign-in is disabled for the demo — use your email or a demo account.")}
        >
          <MicrosoftIcon />
          Microsoft
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-ink-muted">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider">Or continue with</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Demo quick-login */}
      <div className="grid grid-cols-3 gap-2">
        {demoAccounts.map((a) => (
          <button
            key={a.email}
            onClick={() => quickLogin(a)}
            className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 text-center transition-all hover:border-brand hover:bg-white hover:shadow-soft"
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-brand">
              {a.role}
            </span>
            <span className="mt-0.5 block truncate text-xs font-medium text-ink">{a.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Email Address">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mediscribe.ai"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type password"
          />
        </Field>
        {error && (
          <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
            {error}
          </p>
        )}
        <Button type="submit" full size="lg" loading={busy}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-brand hover:text-brand-deep">
          Sign Up
        </Link>
      </p>

      {/* Permission pending popup */}
      {pendingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lift animate-fade-up" role="dialog" aria-modal="true" aria-label="Permission pending">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-warning-bg text-warning">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
              </svg>
            </span>
            <h2 className="mt-5 text-xl font-bold text-ink">Permission pending</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {pendingUser}, your account is still awaiting admin approval. You'll get access to
              your dashboard once the admin approves your request.
            </p>
            <button
              onClick={() => setPendingUser(null)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              OK, got it
            </button>
            <Link
              href="/pending"
              className="mt-3 block text-sm font-medium text-brand hover:text-brand-deep"
            >
              Check approval status
            </Link>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
