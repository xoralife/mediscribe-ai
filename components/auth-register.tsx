"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";

export function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      router.push("/pending?just_registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Register your practice
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Your account starts as{" "}
              <em className="font-medium text-clay-deep not-italic">pending review</em> — an admin
              approves it before you can invite patients or generate notes.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <Field label="Full name">
                <Input required value={form.name} onChange={set("name")} placeholder="Dr. Jane Doe" />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@clinic.com"
                />
              </Field>
              <Field label="Specialization">
                <Input
                  required
                  value={form.specialization}
                  onChange={set("specialization")}
                  placeholder="Internal Medicine"
                />
              </Field>
              <Field label="Password" hint="demo: demo1234">
                <Input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Choose a strong password"
                />
              </Field>
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
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-pine hover:text-leaf">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="relative hidden w-[42%] overflow-hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=1200&auto=format&fit=crop"
          alt="Doctor in clinic"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pine-deep/30 to-pine-deep/85" />
        <div className="absolute bottom-10 left-10 right-10">
          <p className="font-display text-3xl font-medium leading-snug text-paper-light">
            Join a growing number of clinics documenting smarter.
          </p>
        </div>
      </div>
    </div>
  );
}
