"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { SOAPEditor } from "@/components/soap-editor";
import { ConfidenceStrip, SOAPView } from "@/components/soap";
import { Transcript } from "@/components/transcript";
import { api } from "@/lib/api";
import { formatDate, formatDateTime, formatDuration, initials } from "@/lib/format";
import type { Extraction, Report, User } from "@/lib/types";

export function ReportDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [patient, setPatient] = useState<User | null>(null);
  const [drafts, setDrafts] = useState<Extraction | null>(null);
  const [edit, setEdit] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.getReport(params.id).then(async (r) => {
      setReport(r);
      setDrafts(r.extraction_json);
      const pat = (await api.myPatients()).find((p) => p.id === r.patient_id);
      setPatient(pat ?? null);
    });
  }, [params.id]);

  const isApproved = report?.status === "approved";

  const patientInitials = useMemo(
    () => (patient ? initials(patient.name) : "PA"),
    [patient]
  );

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const saveDraft = async () => {
    if (!drafts) return;
    setSaving(true);
    try {
      const updated = await api.updateReport(params.id, drafts);
      setReport(updated);
      setEdit(false);
      flash("Draft saved.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const approve = async () => {
    setApproving(true);
    try {
      const updated = await api.approveReport(params.id);
      setReport(updated);
      setEdit(false);
      flash("Report approved — now visible to the patient.");
    } catch (e) {
      flash(e instanceof Error ? e.message : "Failed to approve.");
    } finally {
      setApproving(false);
    }
  };

  if (!report) {
    return (
      <AppShell nav={NAV.doctor} roleLabel="Doctor">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <Link href="/doctor/reports" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-leaf">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 10H5m4-4-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All reports
      </Link>

      <PageHeader
        eyebrow="Report review"
        title={patient?.name ?? "Patient"}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-ink-soft">{patient?.email ?? "—"}</span>
            {patient?.dob && <span className="font-mono text-xs text-sage">DOB {formatDate(patient.dob)}</span>}
            {isApproved ? (
              <Badge tone="pine" dot>Approved {formatDate(report.approved_at)}</Badge>
            ) : (
              <Badge tone="clay" dot>Draft · awaiting your approval</Badge>
            )}
          </span>
        }
        actions={
          <>
            {!isApproved && (
              <>
                {edit ? (
                  <>
                    <Button variant="ghost" onClick={() => setEdit(false)}>Cancel</Button>
                    <Button onClick={saveDraft} loading={saving}>Save draft</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setEdit(true)}>Edit fields</Button>
                    <Button onClick={approve} loading={approving}>Approve & finalise</Button>
                  </>
                )}
              </>
            )}
          </>
        }
      />

      {toast && (
        <div className="mb-6 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-pine animate-fade-in">
          {toast}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Transcript + audio */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Recording</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{report.audio_name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-sage">
                  {formatDuration(report.duration_sec)} · diarized transcript
                </p>
              </div>
              <button
                onClick={() => setPlaying(!playing)}
                className={`grid h-12 w-12 place-items-center rounded-full transition-all ${
                  playing ? "bg-clay text-paper-light" : "bg-pine text-paper-light hover:bg-leaf"
                }`}
                aria-label={playing ? "Pause transcript demo" : "Play transcript demo"}
              >
                {playing ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
                    <rect x="5" y="4" width="3.5" height="12" rx="1" />
                    <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden>
                    <path d="M6 4.5v11l8-5.5-8-5.5z" />
                  </svg>
                )}
              </button>
            </div>
            <Transcript segments={report.transcript_json} playing={playing} />
          </Card>

          <Card className="p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
              RxNorm validation
            </p>
            <div className="space-y-2">
              {report.validation_flags.length === 0 && (
                <p className="text-sm text-ink-soft">No medication flags on this record.</p>
              )}
              {report.validation_flags.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-line bg-paper px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{String(f.medication ?? "")}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{String(f.note ?? "")}</p>
                  </div>
                  {String(f.status) === "valid" ? (
                    <Badge tone="pine" dot>Validated</Badge>
                  ) : (
                    <Badge tone="rose" dot>Review</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Extraction / SOAP */}
        <div className="space-y-5">
          {drafts && (
            <Card className="p-5">
              <div className="mb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
                  AI extraction · confidence
                </p>
              </div>
              <ConfidenceStrip flags={drafts.confidence_flags} />
            </Card>
          )}

          <Card className="p-5">
            {edit && drafts ? (
              <SOAPEditor extraction={drafts} onChange={setDrafts} />
            ) : (
              report && <SOAPView extraction={report.extraction_json} />
            )}
          </Card>

          {isApproved ? (
            <Card className="flex items-center justify-between p-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Export</p>
                <p className="mt-1 text-sm text-ink-soft">Download a clean clinical PDF.</p>
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
                PDF
              </Button>
            </Card>
          ) : (
            <Card className="border-clay/30 bg-clay/8 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-clay/15 text-clay-deep">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
                    <path d="M10 2l7 3v5c0 4.5-3 7.5-7 8.5C6 17.5 3 14.5 3 10V5l7-3z" />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-base font-semibold text-ink">Pending your approval</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    The patient cannot see this note until you approve it. Review the SOAP fields,
                    edit anything the AI got wrong, then finalise.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button full variant="dark" onClick={() => setEdit(true)}>Review & edit</Button>
                <Button full onClick={approve} loading={approving}>Approve</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
