"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateTime, initials, relativeTime } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.myReports(), api.myPatients()]).then(([r, p]) => {
      setReports(r);
      setPatients(p);
      setLoading(false);
    });
  }, []);

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown patient";

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="Report library"
        title="Clinical reports"
        description="AI-generated drafts waiting for your review, alongside the notes you've already approved."
        actions={
          <Button>
            <Link href="/doctor/generate">+ New report</Link>
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Upload a consultation recording and MediScribe will draft the first SOAP note."
          action={
            <Button>
              <Link href="/doctor/generate">Generate your first report</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const isApproved = r.status === "approved";
            return (
              <Link key={r.id} href={`/doctor/reports/${r.id}`} className="block">
                <Card className="flex flex-wrap items-center justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-pine/10 font-display text-base font-semibold text-pine">
                      {initials(patientName(r.patient_id))}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-ink">
                          {patientName(r.patient_id)}
                        </h3>
                        {isApproved ? (
                          <Badge tone="pine" dot>Approved</Badge>
                        ) : (
                          <Badge tone="clay" dot>Draft · review</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {r.audio_name} · {formatDateTime(r.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">
                      {isApproved ? "Approved" : "Generated"}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {relativeTime(isApproved ? (r.approved_at ?? r.created_at) : r.created_at)}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-sage">
                      {r.transcript_json.length} transcript turns
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
