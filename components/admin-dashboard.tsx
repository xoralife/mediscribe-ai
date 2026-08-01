"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, initials, relativeTime } from "@/lib/format";
import type { AdminStats, AdminUser, IntegrationsStatus, User } from "@/lib/types";

const REFRESH_MS = 20_000;

export function AdminDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState<User[]>([]);
  const [history, setHistory] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [directory, setDirectory] = useState<AdminUser[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [p, s, d, i] = await Promise.all([
        api.pendingDoctors(),
        api.adminStats(),
        api.adminUsers(),
        api.adminIntegrations(),
      ]);
      setPending(p);
      setStats(s);
      setDirectory(d);
      setIntegrations(i);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await api.approveDoctor(id);
      setPending((prev) => prev.filter((u) => u.id !== id));
      setHistory((prev) =>
        [prev.find((u) => u.id === id) ?? (pending.find((u) => u.id === id) as User), ...prev].filter(Boolean)
      );
      flash("Doctor approved.");
      load(true);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Failed to approve.");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    setBusyId(id);
    try {
      await api.rejectDoctor(id);
      setPending((prev) => prev.filter((u) => u.id !== id));
      flash("Application removed.");
      load(true);
    } catch {
      flash("Failed to reject.");
    } finally {
      setBusyId(null);
    }
  };

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <AppShell nav={NAV.admin} roleLabel="Admin">
      <PageHeader
        eyebrow="Admin console"
        title="Platform overview"
        description="Live platform statistics, doctor approvals, and real-time status of the AI pipeline services."
        actions={
          <Button variant="outline" onClick={() => load(true)} loading={refreshing}>
            Refresh
          </Button>
        }
      />

      {toast && (
        <div className="mb-6 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-pine animate-fade-in">
          {toast}
        </div>
      )}

      {/* Live stats */}
      <section className="mb-10">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          Live · refreshes every 20s
        </p>
        {loading && !stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Doctors" value={stats?.doctors ?? 0} />
            <StatCard label="Patients" value={stats?.patients ?? 0} />
            <StatCard label="Reports" value={stats?.reports ?? 0} sub={stats ? `${stats.approved_reports} approved · ${stats.draft_reports} draft` : undefined} />
            <StatCard label="Pending approvals" value={stats?.pending_doctors ?? 0} accent={stats?.pending_doctors ? "clay" : "sage"} />
          </div>
        )}
      </section>

      {/* Pending approvals */}
      <section className="mb-12">
        <div className="mb-4 flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">Doctor approvals</p>
          <span className="font-mono text-[10px] text-sage">{pending.length} waiting</span>
        </div>

        {loading && pending.length === 0 ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <EmptyState
            title="No pending applications"
            description="When a doctor registers, their application will appear here for your review."
            action={
              <Button variant="outline" onClick={() => load()}>
                Refresh
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {pending.map((doc) => (
              <Card key={doc.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-pine/10 font-display text-base font-semibold text-pine">
                      {initials(doc.name)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-ink">{doc.name}</h3>
                        <Badge tone="clay" dot>Pending</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-ink-soft">{doc.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Specialization</p>
                      <p className="text-sm font-medium text-ink">{doc.specialization ?? "—"}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-sage">Applied {relativeTime(doc.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => reject(doc.id)} loading={busyId === doc.id}>
                        Decline
                      </Button>
                      <Button size="sm" onClick={() => setConfirmId(doc.id)}>
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* User directory */}
      <section className="mb-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          User directory · {directory.length} accounts
        </p>
        <Card className="overflow-hidden">
          <div className="divide-y divide-line">
            {directory.map((u) => (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-semibold ${u.role === "doctor" ? "bg-leaf/10 text-leaf" : u.role === "patient" ? "bg-clay/10 text-clay-deep" : "bg-sage/15 text-ink-soft"}`}>
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                      {u.role === "doctor" && (
                        <Badge tone={u.is_approved ? "pine" : "clay"}>
                          {u.is_approved ? "Doctor" : "Pending"}
                        </Badge>
                      )}
                      {u.role === "patient" && <Badge tone="sage">Patient</Badge>}
                    </div>
                    <p className="truncate font-mono text-[10px] text-sage">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">
                      {u.role === "patient" ? "Doctor" : "Specialization"}
                    </p>
                    <p className="text-xs font-medium text-ink">{u.role === "patient" ? (u.doctor_name ?? "—") : (u.specialization ?? "—")}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Reports</p>
                    <p className="font-mono text-xs font-medium text-ink">{u.report_count ?? 0}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Joined</p>
                    <p className="text-xs font-medium text-ink">{formatDate(u.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Live integrations */}
      <section>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          AI pipeline services
        </p>
        <IntegrationsPanel integrations={integrations} loading={loading} onRefresh={() => load(true)} />
      </section>

      {confirmId && (
        <ConfirmDialog
          open={!!confirmId}
          title="Approve this doctor?"
          description={`Patient records and report generation will be available to this doctor.`}
          confirmLabel="Approve"
          onConfirm={async () => {
            try {
              await api.approveDoctor(confirmId);
              setPending((prev) => prev.filter((u) => u.id !== confirmId));
              setHistory((prev) =>
                [prev.find((u) => u.id === confirmId) ?? (pending.find((u) => u.id === confirmId) as User), ...prev].filter(Boolean)
              );
              flash("Doctor approved.");
              load(true);
            } catch (err) {
              flash(err instanceof Error ? err.message : "Failed to approve.");
            }
            setConfirmId(null);
          }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {history.length > 0 && (
        <div className="mt-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            Approved this session
          </p>
          <div className="space-y-3">
            {history.map((doc) => (
              <Card key={doc.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf/10 font-display text-sm font-semibold text-leaf">
                    {initials(doc.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{doc.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{doc.specialization}</p>
                  </div>
                </div>
                <Badge tone="pine">Approved · {formatDate(new Date().toISOString())}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = "pine",
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: "pine" | "clay" | "sage";
}) {
  const tones: Record<string, string> = {
    pine: "text-leaf",
    clay: "text-clay-deep",
    sage: "text-sage",
  };
  return (
    <Card className="p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{label}</p>
      <p className={`mt-2 font-display text-4xl font-semibold tracking-tight ${tones[accent]}`}>{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-sage">{sub}</p>}
    </Card>
  );
}

const INTEGRATION_LABELS: Array<{
  key: Exclude<keyof IntegrationsStatus, "checked_at">;
  label: string;
  note: string;
}> = [
  { key: "database", label: "Database", note: "Supabase Postgres" },
  { key: "mistral", label: "Mistral ASR", note: "Speech-to-text · diarization" },
  { key: "gemini", label: "Gemini", note: "Clinical extraction" },
  { key: "supabase", label: "Supabase", note: "Auth + storage keys" },
  { key: "rxnorm", label: "RxNorm", note: "Medication validation" },
];

function IntegrationsPanel({
  integrations,
  loading,
  onRefresh,
}: {
  integrations: IntegrationsStatus | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  const statusTone = (s: string): "pine" | "rose" | "sage" =>
    s === "ok" ? "pine" : s === "error" ? "rose" : "sage";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
          {integrations
            ? `Last checked ${new Date(integrations.checked_at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" })}`
            : "Probing…"}
        </p>
        <Button size="sm" variant="outline" onClick={onRefresh} loading={loading}>
          Re-check
        </Button>
      </div>
      <ul className="mt-4 divide-y divide-line">
        {INTEGRATION_LABELS.map((item) => {
          const it = integrations?.[item.key];
          return (
            <li key={item.key} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    it?.status === "ok"
                      ? "bg-leaf animate-pulse-soft"
                      : it?.status === "error"
                        ? "bg-rose"
                        : "bg-sage/50"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-ink">{item.label}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{item.note}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {it?.detail && <span className="hidden font-mono text-[10px] text-sage sm:inline">{it.detail}</span>}
                <Badge tone={it ? statusTone(it.status) : "sage"} dot>
                  {it ? (it.status === "ok" ? "Online" : it.status === "error" ? "Error" : "Not set") : "…"}
                </Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin only</h1>
      <p className="mt-2 text-sm text-ink-soft">You don't have permission to view this page.</p>
    </div>
  );
}
