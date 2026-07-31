"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui";
import { demoAccounts } from "@/lib/api";
import { roleHome, useAuth } from "@/lib/auth";

function AuthShell({ children, aside }: { children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <aside className="relative hidden w-[42%] overflow-hidden lg:block">
        {aside}
      </aside>
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

  useEffect(() => {
    if (ready && user) router.replace(roleHome(user.role));
  }, [ready, user, router]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const s = await login(email, password);
      router.replace(roleHome(s.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError("");
    setBusy(true);
    try {
      const s = await login(demoEmail, "demo1234");
      router.replace(roleHome(s.user.role));
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
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop"
            alt="Doctor in consultation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pine-deep/40 to-pine-deep/80" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="font-display text-3xl font-medium leading-snug text-paper-light">
              “It drafts the note while I still listen to my patient.”
            </p>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-paper-light/70">
              Dr. Rohan Deshpande · Internal Medicine
            </p>
          </div>
        </div>
      }
    >
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Sign in to continue. For this demo, any account uses password{" "}
        <code className="rounded bg-cream px-1.5 py-0.5 font-mono text-xs text-ink">demo1234</code>.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {demoAccounts.map((a) => (
          <button
            key={a.email}
            onClick={() => quickLogin(a.email)}
            className="rounded-xl border border-line-strong bg-paper-light px-3 py-2.5 text-center transition-all hover:border-leaf hover:shadow-soft"
          >
            <span className="block font-mono text-[10px] uppercase tracking-wider text-sage">{a.role}</span>
            <span className="mt-0.5 block truncate text-xs font-medium text-ink">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="my-6 flex items-center gap-3 text-sage">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-wider">or sign in</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@clinic.com"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        {error && (
          <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>
        )}
        <Button type="submit" full size="lg" loading={busy}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Are you a doctor?{" "}
        <Link href="/register" className="font-semibold text-pine hover:text-leaf">
          Register your clinic
        </Link>
      </p>
    </AuthShell>
  );
}
