"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader } from "@/components/ui";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ageFromDob, formatDate, initials, relativeTime } from "@/lib/format";
import { errorMessage, isNetworkError } from "@/lib/http";
import type { AdminStats, AdminUser, IntegrationsStatus, User } from "@/lib/types";

const REFRESH_MS = 20_000;

interface EditDraft {
  name: string;
  email: string;
  specialization: string;
  password: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [directory, setDirectory] = useState<AdminUser[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<User[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationsStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState("");

  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [s, d, i, p] = await Promise.all([
        api.adminStats(),
        api.adminUsers(),
        api.adminIntegrations(),
        api.pendingDoctors(),
      ]);
      setStats(s);
      setDirectory(d);
      setIntegrations(i);
      setPendingDoctors(p);
    } catch (e) {
      if (isNetworkError(e)) {
        flash("Cannot reach the backend — is uvicorn running on port 8000?");
      } else {
        flash(errorMessage(e, "Failed to load dashboard."));
      }
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

  const approvePending = async (userId: string) => {
    try {
      await api.approveDoctor(userId);
      flash("Doctor approved — they can now sign in.");
      load(true);
    } catch (err) {
      flash(err instanceof Error ? err.message : "Failed to approve doctor.");
    }
  };

  const openEdit = (u: AdminUser) => {
    setEditTarget(u);
    setEditDraft({
      name: u.name,
      email: u.email,
      specialization: u.specialization ?? "",
      password: "",
    });
    setEditError("");
  };

  const saveEdit = async () => {
    if (!editTarget || !editDraft) return;
    setEditSaving(true);
    setEditError("");
    try {
      await api.adminUpdateUser(editTarget.id, {
        name: editDraft.name,
        email: editDraft.email,
        specialization: editDraft.specialization || null,
        password: editDraft.password || undefined,
      });
      flash("User updated.");
      setEditTarget(null);
      load(true);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setEditSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.adminDeleteUser(deleteId);
      flash("User removed.");
      load(true);
    } catch (err) {
      flash(err instanceof Error ? err.message : "Failed to remove user.");
    }
    setDeleteId(null);
  };

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <AppShell nav={NAV.admin} roleLabel="Admin">
      <PageHeader
        eyebrow="Admin console"
        title="Platform overview"
        description="Approve doctor permission requests, manage the user directory, and monitor the AI pipeline services."
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
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
            Permission requests
          </p>
          {stats && stats.pending_doctors > 0 && (
            <Badge tone="clay" dot>{stats.pending_doctors} pending</Badge>
          )}
        </div>
        <Card className="overflow-hidden">
          {loading && directory.length === 0 ? (
            <div className="p-6 text-sm text-ink-soft">Loading requests…</div>
          ) : pendingDoctors.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-soft">
                No pending requests. Doctors who register will appear here for approval.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingDoctors.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-warning-bg text-sm font-semibold text-warning">
                      {initials(u.name)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink">{u.name}</p>
                        <Badge tone="clay" dot>Awaiting approval</Badge>
                      </div>
                      <p className="truncate text-xs text-ink-soft">
                        {u.email} · {u.specialization || "General Practice"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setDeleteId(u.id)}>
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => approvePending(u.id)}>
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* User directory */}
      <section className="mb-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          Doctors & patients · {directory.length} accounts
        </p>
        {loading && directory.length === 0 ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-cream" />
            ))}
          </div>
        ) : directory.length === 0 ? (
          <EmptyState
            title="No accounts yet"
            description="Doctors register themselves — pending requests will appear above."
          />
        ) : (
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
                      <p className="truncate font-mono text-[10px] text-sage">
                        {u.email}
                        {u.role === "patient" &&
                          (() => {
                            const age = ageFromDob(u.dob);
                            return age != null ? ` · age ${age}` : "";
                          })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">
                        {u.role === "patient" ? "Doctor" : "Specialization"}
                      </p>
                      <p className="text-xs font-medium text-ink">{u.role === "patient" ? (u.doctor_name ?? "—") : (u.specialization ?? "—")}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Reports</p>
                      <p className="font-mono text-xs font-medium text-ink">{u.report_count ?? 0}</p>
                    </div>
                    <div className="hidden lg:block">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Joined</p>
                      <p className="text-xs font-medium text-ink">{formatDate(u.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.role === "doctor" && (
                        <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                          Edit
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(u.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      {/* Live integrations */}
      <section>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-sage">
          AI pipeline services
        </p>
        <IntegrationsPanel integrations={integrations} loading={loading} onRefresh={() => load(true)} />
      </section>

      {/* Edit modal */}
      {editTarget && editDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-pine-deep/50 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-paper-light p-6 shadow-lift animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">Edit doctor</h3>
              <button onClick={() => setEditTarget(null)} className="text-sage hover:text-ink">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Full name">
                <Input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
              </Field>
              <Field label="Email">
                <Input type="email" value={editDraft.email} onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} />
              </Field>
              <Field label="Specialization">
                <Input
                  value={editDraft.specialization}
                  onChange={(e) => setEditDraft({ ...editDraft, specialization: e.target.value })}
                />
              </Field>
              <Field label="Reset password" hint="leave blank to keep current">
                <Input
                  type="password"
                  placeholder="New password"
                  value={editDraft.password}
                  onChange={(e) => setEditDraft({ ...editDraft, password: e.target.value })}
                />
              </Field>
              {editError && (
                <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                  {editError}
                </p>
              )}
              <div className="flex items-center justify-end gap-3 pt-1">
                <Button variant="ghost" onClick={() => setEditTarget(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEdit} loading={editSaving}>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Remove this account?"
        description="This permanently deletes the user. Patients' records are removed too. Doctors with linked patients or reports cannot be removed."
        confirmLabel="Delete"
        tone="rose"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
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
