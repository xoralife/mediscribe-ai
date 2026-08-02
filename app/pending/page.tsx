"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { initials, resolveMediaUrl } from "@/lib/format";

function PendingInner() {
  const { user, updateUser } = useAuth();
  const [requesting, setRequesting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const requested = user?.permission_requested || done;

  const requestPermission = async () => {
    setError("");
    setRequesting(true);
    try {
      const updated = await api.requestPermission();
      updateUser(updated);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the request.");
    } finally {
      setRequesting(false);
    }
  };

  const avatar = user?.avatar_url ? resolveMediaUrl(user.avatar_url) : null;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <div className="dotted-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <Logo />
        </div>

        {/* Profile card */}
        <div className="mx-auto mb-8 w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-card">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={user?.name ?? "Doctor"}
              className="mx-auto h-24 w-24 rounded-full border-4 border-brand-light object-cover"
            />
          ) : (
            <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-light text-3xl font-semibold text-brand">
              {initials(user?.name ?? "D")}
            </span>
          )}
          <p className="mt-4 text-xl font-bold text-ink">{user?.name}</p>
          <p className="mt-0.5 text-sm text-ink-soft">
            {user?.specialization || "Medical Professional"}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{user?.email}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-bg px-3 py-1 text-xs font-semibold text-warning">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse-soft" />
            {requested ? "Permission requested" : "Permission required"}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {requested ? "Request sent — pending approval" : "Your account needs approval"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
          {requested ? (
            <>
              Your permission request is with the admin. You'll be able to use the platform once
              they approve you. Check back shortly.
            </>
          ) : (
            <>
              Your account was created, but you can't use the platform yet. Request access from the
              admin — they'll review your details and approve you.
            </>
          )}
        </p>

        {!requested && (
          <div className="mt-8">
            <Button size="lg" loading={requesting} onClick={requestPermission}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="M10 1.5 11.8 7l5.7 1.8-5.7 1.8L10 16.5 8.2 10.6 2.5 8.8 8.2 7 10 1.5z" />
              </svg>
              Request Permission
            </Button>
            {error && (
              <p className="mx-auto mt-4 max-w-sm rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-ink-muted">
              This sends a request to the admin dashboard — they approve you from there.
            </p>
          </div>
        )}

        {requested && (
          <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-border bg-white p-6 text-left shadow-card">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              What happens next
            </p>
            <ol className="space-y-4">
              {[
                ["01", "Admin reviews your specialization and details"],
                ["02", "Your role changes to approved doctor"],
                ["03", "Sign in, add patients, and start generating notes"],
              ].map(([n, t]) => (
                <li key={n} className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm font-bold text-brand">{n}</span>
                  <p className="text-sm text-ink-soft">{t}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/login"
            className="rounded-xl border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Check status
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
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
