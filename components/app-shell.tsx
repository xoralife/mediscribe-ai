"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";
import { initials } from "@/lib/format";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
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
  shield: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M10 1.5 17 4v6c0 4.5-3 7.5-7 8.5C6 17.5 3 14.5 3 10V4l7-2.5zm-3.5 9h7V9h-7v1.5z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M12.5 2H5v16h7.5v-2H7V4h5.5V2zm3.6 5.1L13.9 9h-4.4v2h4.4l2.2 1.9 1.1-1.1L15.9 10l1.3-1.8-1.1-1.1z" />
    </svg>
  ),
};

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

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-paper-light/80 backdrop-blur lg:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item)
                  ? "bg-pine text-paper-light"
                  : "text-ink-soft hover:bg-cream hover:text-ink"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf/15 font-display text-sm font-semibold text-leaf">
                {initials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{roleLabel}</p>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="text-sage transition-colors hover:text-rose"
              >
                {icons.logout}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-paper-light/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo size="sm" />
        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-line-strong px-3 py-1.5 text-xs font-medium text-ink-soft"
          >
            Sign out
          </button>
        )}
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
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
  ] as NavItem[],
  patient: [
    { href: "/patient", label: "My Reports", icon: icons.file, exact: true },
  ] as NavItem[],
};
