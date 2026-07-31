"use client";

import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, initials, relativeTime } from "@/lib/format";
import type { User } from "@/lib/types";

export function AdminDashboard() {
  const { user } = useAuth();
  const [pending, setPending] = useState<User[]>([]);
  const [history, setHistory] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPending(await api.pendingDoctors());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await api.approveDoctor(id);
      setPending((prev) => prev.filter((u) => u.id !== id));
      setHistory((prev) => [prev.find((u) => u.id === id) ?? (pending.find((u) => u.id === id) as User), ...prev].filter(Boolean));
      flash("Doctor approved.");
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
        title="Doctor approvals"
        description="Review pending doctor registrations. Approved doctors can invite patients and generate clinical notes."
      />

      {toast && (
        <div className="mb-6 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-pine animate-fade-in">
          {toast}
        </div>
      )}

      {loading ? (
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
            <Button variant="outline" onClick={load}>
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
                    <Button
                      size="sm"
                      onClick={() => setConfirmId(doc.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          </div>
        )}

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
                setHistory((prev) => [prev.find((u) => u.id === confirmId) ?? (pending.find((u) => u.id === confirmId) as User), ...prev].filter(Boolean));
                flash("Doctor approved.");
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

function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin only</h1>
      <p className="mt-2 text-sm text-ink-soft">You don't have permission to view this page.</p>
    </div>
  );
}
