"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export function RegisterPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(`/pending`);
  }, [ready, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        specialization: specialization.trim(),
      });
      // Request sent to the admin — show the pending confirmation, no login.
      setRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — branding panel */}
      <aside className="relative hidden w-[45%] overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doctor-login.jpg"
            alt=""
            className="h-full w-full object-cover object-top opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/60 to-brand-deep/40" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo dark />
          <div>
            <h2 className="max-w-sm text-3xl font-bold leading-snug text-white">
              Join MediScribe as a doctor.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Register your practice — your approval request goes straight to our admin.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-accent" aria-hidden>
                <path d="M10 1.5 11.8 7l5.7 1.8-5.7 1.8L10 16.5 8.2 10.6 2.5 8.8 8.2 7 10 1.5z" />
              </svg>
              Admin approval required before you can sign in.
            </div>
          </div>
        </div>
      </aside>

      {/* Right — form / pending confirmation */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between px-6 py-6 sm:px-10">
          <Logo />
          <Link href="/login" className="text-sm font-medium text-brand hover:text-brand-deep">
            Already have an account? Sign in
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          {registered ? (
            <div className="w-full max-w-md text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-warning-bg text-warning">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden>
                  <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Registration sent for approval
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                Your approval request is now with the admin. Once they approve you, sign in with
                your email and password to access your dashboard.
              </p>
              <div className="mx-auto mt-8 w-full max-w-sm rounded-2xl border border-border bg-surface-alt p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  What happens next
                </p>
                <ol className="mt-3 space-y-3 text-sm text-ink-soft">
                  <li className="flex gap-2"><span className="font-bold text-brand">1.</span> Admin reviews your request</li>
                  <li className="flex gap-2"><span className="font-bold text-brand">2.</span> Your account is approved</li>
                  <li className="flex gap-2"><span className="font-bold text-brand">3.</span> Sign in to start using MediScribe</li>
                </ol>
              </div>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-deep"
              >
                Go to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Register as a doctor
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                  Create your account — an approval request is sent to the admin automatically.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-4">
                  <Field label="Full name">
                    <Input
                      required
                      placeholder="Dr. Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      type="email"
                      required
                      placeholder="doctor@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field label="Specialization" hint="Optional">
                    <Input
                      placeholder="e.g. Cardiology"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Password">
                      <Input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>
                    <Field label="Confirm Password">
                      <Input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </Field>
                  </div>
                  {error && (
                    <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                      {error}
                    </p>
                  )}
                  <Button type="submit" full size="lg" loading={busy}>
                    Create account
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-ink-soft">
                  By registering you agree to be contacted by our team for verification.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
