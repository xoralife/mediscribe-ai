"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { initials, resolveMediaUrl } from "@/lib/format";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  unread?: boolean;
}

const icons = {
  home: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M10 2.5 3 8v9h4.5v-5h5v5H17V8l-7-5.5z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zm6.5 2a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.5 17a5.5 5.5 0 0111 0h-11zm9.3-3.2A6 6 0 0118.5 17h-3.2a7 7 0 00-3.5-5.2z" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M10 1.5 11.8 7l5.7 1.8-5.7 1.8L10 16.5 8.2 10.6 2.5 8.8 8.2 7 10 1.5z" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M5 2h7l3.5 3.5V18H5V2zm6.5 1v3h3L11.5 3zM7 9h6v1H7V9zm0 3h6v1H7v-1zm0 3h4v1H7v-1z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M6 2v2H4.5A1.5 1.5 0 003 5.5v11A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0015.5 4H14V2h-1.5v2h-5V2H6zM4.5 7h11v8.5h-11V7zm2 2V10h7V9h-7zm0 3h2v1.5h-2V12zm3.5 0h2v1.5h-2V12z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M10 1.5 17 4v6c0 4.5-3 7.5-7 8.5C6 17.5 3 14.5 3 10V4l7-2.5zm-3.5 9h7V9h-7v1.5z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M2.5 4h15a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5zm7.5 7L3 6v8h14V6l-7 5z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M10 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm-7 8.5a7 7 0 0114 0H3z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M12.5 2H5v16h7.5v-2H7V4h5.5V2zm3.6 5.1L13.9 9h-4.4v2h4.4l2.2 1.9 1.1-1.1L15.9 10l1.3-1.8-1.1-1.1z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const avatarUrl = user?.avatar_url ? resolveMediaUrl(user.avatar_url) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (user?.role === "doctor") router.push(`/doctor/patients?q=${encodeURIComponent(q)}`);
    else if (user?.role === "patient") router.push(`/patient`);
    else router.push(`/admin`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-3 border-b border-border bg-white px-4 sm:px-6">
      {/* Global search */}
      <form onSubmit={submit} className="relative hidden w-full max-w-md sm:block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
          {icons.search}
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients, sessions, notes..."
          className="w-full rounded-lg border border-border bg-surface-alt py-2 pl-9 pr-16 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-white px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          Ctrl+K
        </kbd>
      </form>

      {user?.role === "doctor" && (
        <Link
          href="/doctor/generate"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-accent-deep active:scale-[0.98]"
        >
          {icons.plus}
          New Session
        </Link>
      )}
      {user && (
        avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={user.name}
            title={user.name}
            className="h-9 w-9 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white"
            title={user.name}
          >
            {initials(user.name)}
          </span>
        )
      )}
    </header>
  );
}

export function AppShell({
  nav,
  children,
  roleLabel,
}: {
  nav: NavItem[];
  children: React.ReactNode;
  roleLabel: string;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user?.role !== "doctor") return;
    let active = true;
    const poll = async () => {
      try {
        const msgs = await api.doctorMessages(true);
        if (active) setUnread(msgs.length);
      } catch {
        /* ignore — badge is best-effort */
      }
    };
    poll();
    const timer = setInterval(poll, 20_000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user?.role]);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Logo />
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive(item)
                  ? "bg-brand-light text-brand"
                  : "text-ink-soft hover:bg-surface-alt hover:text-ink"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.unread && unread > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1.5 font-mono text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          ))}

          {user?.role !== "admin" && (
            <div className="pt-4 mt-4 border-t border-border">
              <Link
                href={user?.role === "doctor" ? "/doctor/profile" : "/patient"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  pathname === "/doctor/profile"
                    ? "bg-brand-light text-brand"
                    : "text-ink-soft hover:bg-surface-alt hover:text-ink"
                }`}
              >
                {icons.user}
                <span className="flex-1">Profile</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Help Center card */}
        <div className="shrink-0 px-4 pb-4 pt-1">
          <div className="rounded-xl bg-brand-light p-4">
            <p className="text-sm font-semibold text-brand-deep">Help Center</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Please contact us for more information.
            </p>
            <Link
              href="/health"
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-deep"
            >
              Go to Help Center
            </Link>
          </div>
        </div>

        {/* User footer */}
        <div className="shrink-0 border-t border-border p-4">
          {user && (
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(user.avatar_url)}
                  alt={user.name}
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-semibold text-white">
                  {initials(user.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-muted">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
              >
                {icons.logout}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
        <Logo size="sm" />
        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-ink-soft"
          >
            Sign out
          </button>
        )}
      </div>

      {/* Content */}
      <main className="min-h-screen flex-1 lg:ml-64">
        <TopBar />
        <div className="px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}

export const NAV = {
  admin: [
    { href: "/admin", label: "Console", icon: icons.shield, exact: true },
    { href: "/admin/analytics", label: "Analytics", icon: icons.spark },
  ] as NavItem[],
  doctor: [
    { href: "/doctor", label: "Overview", icon: icons.home, exact: true },
    { href: "/doctor/patients", label: "Patients", icon: icons.users },
    { href: "/doctor/reports", label: "Reports", icon: icons.file },
    { href: "/doctor/messages", label: "Messages", icon: icons.mail, unread: true },
  ] as NavItem[],
  patient: [
    { href: "/patient", label: "Appointments", icon: icons.calendar, exact: true },
  ] as NavItem[],
};
