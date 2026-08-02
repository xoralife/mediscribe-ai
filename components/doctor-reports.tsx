"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Input } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, initials, relativeTime, transcriptSegments } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([api.myReports(), api.myPatients()]).then(([r, p]) => {
      setReports(r);
      setPatients(p);
      setLoading(false);
    });
  }, []);

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown patient";

  const filtered = reports.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      patientName(r.patient_id).toLowerCase().includes(q) ||
      (r.audio_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Sessions</h1>
          <p className="mt-2 text-sm text-ink-soft">View and manage your patient sessions</p>
        </div>
        <Button>
          <Link href="/doctor/generate" className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            New Session
          </Link>
        </Button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-xs">
            <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13.5 13.5L17 17" strokeLinecap="round" />
            </svg>
            <Input
              type="search"
              placeholder="Quick search (client-side)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
              </svg>
              Show Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3">Actions</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Keypoints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-ink-soft">Loading sessions…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-10 w-10 text-border-strong" stroke="currentColor" strokeWidth="1.2">
                      <path d="M5 3h11l4 4v14H5V3zm10 1v4h4l-4-4z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-3 font-medium text-ink">No sessions found.</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {search.trim() ? "Try adjusting your search." : "Create a new session or adjust filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const isApproved = r.status === "approved";
                  const turns = transcriptSegments(r.transcript_json).length;
                  return (
                    <tr key={r.id} className="transition-colors hover:bg-surface-alt">
                      <td className="px-4 py-3">
                        <Link
                          href={`/doctor/reports/${r.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-white"
                        >
                          Open
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                            {initials(patientName(r.patient_id))}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">{patientName(r.patient_id)}</p>
                            {isApproved ? (
                              <Badge tone="pine" dot>Approved</Badge>
                            ) : (
                              <Badge tone="clay" dot>Draft · review</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">
                        <p>{formatDate(r.created_at)}</p>
                        <p className="text-xs text-ink-muted">{relativeTime(r.created_at)}</p>
                      </td>
                      <td className="px-4 py-3 text-ink-soft">{r.audio_name ?? "Consultation"}</td>
                      <td className="max-w-[220px] px-4 py-3">
                        <p className="truncate text-ink-soft">
                          {r.extraction_json?.diagnosis?.[0] ?? r.extraction_json?.soap?.assessment ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-ink-soft">
                          {turns} turns
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
