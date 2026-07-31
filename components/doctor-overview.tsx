"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, initials, relativeTime } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function DoctorOverview() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.myPatients(), api.myReports()]).then(([p, r]) => {
      setPatients(p);
      setReports(r);
      setLoading(false);
    });
  }, []);

  const drafts = reports.filter((r) => r.status === "draft_generated");
  const approved = reports.filter((r) => r.status === "approved");

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown patient";

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="Doctor workspace"
        title={`Good to see you, ${user?.name.split(" ")[0] ?? "Doctor"}`}
        description="Your practice at a glance — invite patients, generate notes from consultations, and review AI drafts."
        actions={
          <Button>
            <Link href="/doctor/generate">+ Generate note</Link>
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-3">
            <StatCard label="Patients" value={patients.length} icon="users" />
            <StatCard label="Drafts awaiting review" value={drafts.length} icon="draft" tone="clay" />
            <StatCard label="Approved reports" value={approved.length} icon="check" tone="leaf" />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-ink">Latest reports</h2>
                <Link href="/doctor/reports" className="text-sm font-medium text-pine hover:text-leaf">
                  View all
                </Link>
              </div>
              {reports.length === 0 ? (
                <EmptyState
                  title="No reports yet"
                  description="Upload a consultation recording to generate your first AI draft."
                  action={
                    <Button variant="outline">
                      <Link href="/doctor/generate">Generate a note</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {reports.slice(0, 4).map((r) => (
                    <Link key={r.id} href={`/doctor/reports/${r.id}`} className="block">
                      <Card className="p-4 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">{patientName(r.patient_id)}</p>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {r.audio_name} · {relativeTime(r.created_at)}
                            </p>
                          </div>
                          {r.status === "approved" ? (
                            <Badge tone="pine" dot>Approved</Badge>
                          ) : (
                            <Badge tone="clay" dot>Draft</Badge>
                          )}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-ink">Your patients</h2>
                <Link href="/doctor/patients" className="text-sm font-medium text-pine hover:text-leaf">
                  Manage
                </Link>
              </div>
              {patients.length === 0 ? (
                <EmptyState
                  title="No patients invited"
                  description="Create and invite your first patient to start building their care records."
                  action={
                    <Button variant="outline">
                      <Link href="/doctor/patients?new=1">Invite a patient</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {patients.map((p) => (
                    <Card key={p.id} className="flex items-center gap-3 p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf/10 font-display text-sm font-semibold text-leaf">
                        {initials(p.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink-soft">
                          DOB {p.dob ? formatDate(p.dob) : "—"}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                        {reports.filter((r) => r.patient_id === p.id).length} reports
                      </span>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone = "pine",
}: {
  label: string;
  value: number;
  icon: "users" | "draft" | "check";
  tone?: "pine" | "clay" | "leaf";
}) {
  const toneCls: Record<string, string> = {
    pine: "bg-pine text-paper-light",
    clay: "bg-clay/15 text-clay-deep",
    leaf: "bg-leaf/15 text-leaf",
  };
  const paths: Record<string, React.ReactNode> = {
    users: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7.5 1.5a2.75 2.75 0 100-5.5 2.75 2.75 0 000 5.5zM2 19.5a7 7 0 0114 0H2zm11.5-1.7c.3.5.5 1.1.5 1.7h8a5.5 5.5 0 00-8.5-1.7z" />
      </svg>
    ),
    draft: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M5 3h11l4 4v14H5V3zm10 1v4h4l-4-4zM8 11h8v1.5H8V11zm0 3.5h8V16H8v-1.5z" />
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18zm-1.2 13-4-4 1.4-1.4 2.6 2.6 5-5L17 9.8l-6.2 6.2z" />
      </svg>
    ),
  };
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${toneCls[tone]}`}>
        {paths[icon]}
      </span>
      <div>
        <p className="font-display text-3xl font-semibold text-ink">{value}</p>
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
    </Card>
  );
}
