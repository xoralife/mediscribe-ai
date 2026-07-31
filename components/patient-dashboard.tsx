"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, formatDuration, relativeTime } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function PatientDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [doctor, setDoctor] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.patientReports(), api.patientDoctors()]).then(([r, d]) => {
      setReports(r);
      setDoctor(d);
      setLoading(false);
    });
  }, []);

  const docName = doctor[0]?.name ?? "your doctor";

  return (
    <AppShell nav={NAV.patient} roleLabel="Patient">
      <PageHeader
        eyebrow="Patient portal"
        title="Your health records"
        description={`Reports below were reviewed and approved by ${docName}. You can only ever see notes your doctor has finalised.`}
      />

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="When your doctor approves a note from your consultation, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <Card key={r.id} className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                      <path d="M5 3h11l4 4v14H5V3zm10 1v4h4l-4-4zM8 11h8v1.5H8V11zm0 3.5h8V16H8v-1.5zm0 3.5h6v1.5H8V18z" />
                    </svg>
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        Consultation · {formatDate(r.approved_at)}
                      </h3>
                      <Badge tone="pine" dot>Approved</Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {r.extraction_json.diagnosis.join(" · ") || "Consultation note"} ·{" "}
                      {r.audio_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                    {formatDuration(r.duration_sec)} · {relativeTime(r.approved_at ?? r.created_at)}
                  </span>
                  <Link
                    href={`/patient/reports/${r.id}`}
                    className="rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-leaf hover:text-leaf"
                  >
                    View
                  </Link>
                </div>
              </div>
              <div className="border-t border-line bg-paper px-6 py-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Assessment</p>
                    <p className="mt-1 text-sm text-ink line-clamp-2">{r.extraction_json.soap.assessment}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Plan</p>
                    <p className="mt-1 text-sm text-ink line-clamp-2">{r.extraction_json.soap.plan}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Medications</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {r.extraction_json.medications.map((m, i) => (
                        <span key={i} className="rounded-full border border-line-strong bg-paper-light px-2.5 py-0.5 text-xs text-ink">
                          {m.name} {m.dosage}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
