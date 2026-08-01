"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";

function PendingInner() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-3xl border border-line bg-paper-light shadow-lift">
          <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-clay" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
            <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Your application is under review
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
          Thanks for registering. An admin needs to approve your account before you can add
          patients or generate notes. Check back shortly — in the demo, sign in as the{" "}
          <Link href="/login" className="font-semibold text-pine hover:text-leaf">
            admin
          </Link>{" "}
          to approve it.
        </p>

        <div className="mt-10 rounded-2xl border border-line bg-paper-light/80 p-6 text-left shadow-soft">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            What happens next
          </p>
          <ol className="space-y-4">
            {[
              ["01", "Admin reviews your specialization and details"],
              ["02", "Your role changes from pending to approved doctor"],
              ["03", "Sign in, add patients, and start generating notes"],
            ].map(([n, t]) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-0.5 font-display text-sm font-semibold text-leaf">{n}</span>
                <p className="text-sm text-ink-soft">{t}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/login"
            className="rounded-xl border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-leaf hover:text-leaf"
          >
            Check status
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-pine px-5 py-2.5 text-sm font-medium text-paper-light transition-colors hover:bg-leaf"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PendingInner />
    </Suspense>
  );
}
