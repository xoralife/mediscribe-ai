"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, initials, relativeTime } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function DoctorOverview() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.myPatients(), api.myReports(), api.doctorMessages(true)])
      .then(([p, r, msgs]) => {
        setPatients(p);
        setReports(r);
        setUnreadMessages(msgs.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const drafts = reports.filter((r) => r.status === "draft_generated");
  const approved = reports.filter((r) => r.status === "approved");
  const totalSec = reports.reduce((s, r) => s + (r.duration_sec ?? 0), 0);

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown patient";

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Welcome back, {user?.name.split(" ")[0] ?? "Doctor"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/doctor/generate"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-all hover:border-brand hover:text-brand"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M10 2a6.5 6.5 0 00-6.5 6.5c0 1.6.6 3 1.6 4.1L3 18h4.2a3 3 0 005.6 0H17l-2.1-5.4a6.5 6.5 0 00-4.9-10.6zm-2 3.2v1.7H6.3v2H8v1.7h2V8.9h1.7v-2H10V5.2H8z" />
            </svg>
            Transcribe Audio
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : (
        <>
          {unreadMessages > 0 && (
            <Link
              href="/doctor/messages"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warning/30 bg-warning-bg px-5 py-4 shadow-soft transition-all hover:border-warning/50"
            >
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-warning" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 8l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {unreadMessages} new message{unreadMessages === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-ink-soft">
                    Someone contacted you from the website. Open your inbox to read it.
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-warning px-3 py-1.5 text-xs font-semibold text-white">
                View messages →
              </span>
            </Link>
          )}

          {/* Stat cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard label="Total Sessions" value={String(reports.length)} sub="0% from last month" icon="doc" tone="blue" />
            <StatCard label="Total Patients" value={String(patients.length)} sub="0% from last month" icon="users" tone="purple" />
            <StatCard label="Recording Time" value={formatDuration(totalSec)} sub="0% from last month" icon="clock" tone="green" />
          </div>

          {/* Recent sessions */}
          <Card className="mt-10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Recent Sessions</h2>
              <Link href="/doctor/reports" className="text-sm font-medium text-brand hover:text-brand-deep">
                View All &gt;
              </Link>
            </div>
            {reports.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-sm text-ink-soft">
                  No recent sessions found. Start a new session to get started.
                </p>
                <Button className="mt-4">
                  <Link href="/doctor/generate">Start a session</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {reports.slice(0, 5).map((r) => (
                  <Link key={r.id} href={`/doctor/reports/${r.id}`} className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-surface-alt">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{patientName(r.patient_id)}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {r.audio_name ?? "Consultation audio"} · {relativeTime(r.created_at)}
                      </p>
                    </div>
                    {r.status === "approved" ? (
                      <Badge tone="pine" dot>Approved</Badge>
                    ) : (
                      <Badge tone="clay" dot>Draft</Badge>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Bottom row */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-base font-semibold text-ink">Usage Statistics</h2>
              <p className="mt-1 text-xs text-ink-soft">Sessions per day for the last 7 days</p>
              {reports.length === 0 ? (
                <p className="mt-6 text-sm text-ink-soft">No session data yet. Start a session to see statistics.</p>
              ) : (
                <>
                  <BarChart data={weeklyReportCounts(reports)} />
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Recent session history
                    </p>
                    <div className="mt-2 max-h-44 space-y-1 overflow-y-auto">
                      {reports.slice(0, 8).map((r) => (
                        <div key={r.id} className="flex items-center justify-between gap-3 py-1.5">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">{patientName(r.patient_id)}</p>
                            <p className="text-xs text-ink-soft">{relativeTime(r.created_at)}</p>
                          </div>
                          {r.status === "approved" ? (
                            <Badge tone="pine" dot>Approved</Badge>
                          ) : (
                            <Badge tone="clay" dot>Draft</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-ink">Recent Patients</h2>
                  <p className="mt-1 text-xs text-ink-soft">Patients you've recently worked with</p>
                </div>
                <Link href="/doctor/patients" className="text-sm font-medium text-brand hover:text-brand-deep">
                  View All &gt;
                </Link>
              </div>
              {patients.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <p className="text-sm text-ink-soft">No patients found. Add a new patient to get started.</p>
                  <Button variant="outline" className="mt-4">
                    <Link href="/doctor/patients?new=1">Add a patient</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {patients.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-light text-sm font-semibold text-brand">
                        {initials(p.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink-soft">
                          DOB {p.dob ? formatDate(p.dob) : "—"}
                        </p>
                      </div>
                      <span className="text-xs text-ink-muted">
                        {reports.filter((r) => r.patient_id === p.id).length} reports
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}

function weeklyReportCounts(reports: Report[]): { day: string; value: number }[] {
  const days: { day: string; value: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const count = reports.filter((r) => {
      const created = new Date(r.created_at);
      return `${created.getFullYear()}-${created.getMonth()}-${created.getDate()}` === key;
    }).length;
    days.push({ day: d.toLocaleDateString("en-US", { weekday: "short" }), value: count });
  }
  return days;
}

function BarChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="mt-6 flex h-40 items-end justify-between gap-3">
      {data.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-md bg-brand/70 transition-all hover:bg-brand"
            style={{ height: `${Math.round((d.value / max) * 100)}%` }}
          />
          <span className="text-[10px] font-medium text-ink-muted">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(totalSec: number): string {
  if (totalSec <= 0) return "0 sec";
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s} sec`;
  return `${m}m ${s}s`;
}

function StatCard({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: "doc" | "users" | "clock";
  tone: "blue" | "purple" | "green";
}) {
  const toneCls: Record<string, string> = {
    blue: "bg-brand/10 text-brand",
    purple: "bg-indigo-100 text-indigo-600",
    green: "bg-emerald-100 text-emerald-600",
  };
  const paths: Record<string, React.ReactNode> = {
    doc: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M5 3h11l4 4v14H5V3zm10 1v4h4l-4-4zM8 11h8v1.5H8V11zm0 3.5h8V16H8v-1.5z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7.5 1.5a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5zM2 19.5a7 7 0 0114 0H2zm11.5-1.7c.3.5.5 1.1.5 1.7h8a5.5 5.5 0 00-8.5-1.7z" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm1 5h-2v5l4.2 2.5 1-1.7-3.2-1.8V8z" />
      </svg>
    ),
  };
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${toneCls[tone]}`}>
        {paths[icon]}
      </span>
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-soft">{label}</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">{sub}</p>
      </div>
    </Card>
  );
}
