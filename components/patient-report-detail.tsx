"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card } from "@/components/ui";
import { ConfidenceStrip, SOAPView } from "@/components/soap";
import { api } from "@/lib/api";
import { formatDate, formatDateTime, formatDuration } from "@/lib/format";
import type { Report, User } from "@/lib/types";

export function PatientReportDetail() {
  const params = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [doctor, setDoctor] = useState<User[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.getReport(params.id).then(async (r) => {
      if (r.status !== "approved") {
        setReport(null);
        return;
      }
      setReport(r);
      setDoctor(await api.patientDoctors());
    });
  }, [params.id]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  if (!report) {
    return (
      <AppShell nav={NAV.patient} roleLabel="Patient">
        <div className="py-24 text-center">
          <p className="font-display text-2xl font-semibold text-ink">Report unavailable</p>
          <p className="mt-2 text-sm text-ink-soft">
            This report is either still a draft or does not belong to you.
          </p>
          <Link href="/patient" className="mt-6 inline-block text-sm font-medium text-pine hover:text-leaf">
            Back to my reports
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={NAV.patient} roleLabel="Patient">
      <Link href="/patient" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-leaf">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 10H5m4-4-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        My reports
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">Finalised note</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Consultation record
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Reviewed & approved by {doctor[0]?.name ?? "your doctor"} on{" "}
            {formatDate(report.approved_at)} · {formatDateTime(report.approved_at)}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              const blob = await api.downloadReportPdf(report.id);
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `report-${report.id}.pdf`;
              a.click();
              URL.revokeObjectURL(url);
              flash("PDF downloading…");
            } catch (err) {
              flash(err instanceof Error ? err.message : "PDF generation failed.");
            }
          }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="mr-1.5 h-4 w-4" aria-hidden>
            <path d="M10 2v9m0 0L6.5 7.5M10 11l3.5-3.5M4 13v3a2 2 0 002 2h8a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download PDF
        </Button>
      </div>

      {toast && (
        <div className="mb-6 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-pine animate-fade-in">
          {toast}
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Card className="flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-pine/10 text-pine">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.6-4-2.4V7z" />
            </svg>
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Recording</p>
            <p className="text-sm font-medium text-ink">{report.audio_name}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-clay/10 text-clay-deep">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Duration</p>
            <p className="text-sm font-medium text-ink">{formatDuration(report.duration_sec)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-leaf/10 text-leaf">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden>
              <path d="M20 6l-9 9-4-4-1.4 1.4L11 18l10-10-1-2z" />
            </svg>
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Status</p>
            <p className="text-sm font-medium text-ink">Approved by doctor</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Card className="p-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
              Diagnosis
            </p>
            <div className="flex flex-wrap gap-2">
              {report.extraction_json.diagnosis.map((d, i) => (
                <span key={i} className="rounded-full border border-clay/30 bg-clay/10 px-3 py-1 text-xs font-medium text-clay-deep">
                  {d}
                </span>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
              What to watch
            </p>
            <ul className="space-y-2.5">
              {report.extraction_json.follow_up_points.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-6">
          <SOAPView extraction={report.extraction_json} />
        </Card>
      </div>

      {report.extraction_json.confidence_flags?.length ? (
        <Card className="mt-6 p-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
            Note quality
          </p>
          <ConfidenceStrip flags={report.extraction_json.confidence_flags} />
        </Card>
      ) : null}
    </AppShell>
  );
}
