"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Button, Card, Field, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDuration } from "@/lib/format";
import type { Report, User } from "@/lib/types";

type Phase = "idle" | "uploading" | "transcribing" | "extracting" | "validating" | "done";

const PHASES: { key: Phase; label: string; detail: string }[] = [
  { key: "transcribing", label: "Transcribing with diarization", detail: "Mistral ASR separates each speaker" },
  { key: "extracting", label: "Structuring clinical content", detail: "Gemini 3.6 Flash builds symptoms, diagnosis, SOAP" },
  { key: "validating", label: "Validating medications", detail: "Every drug cross-checked against RxNorm" },
  { key: "done", label: "Draft ready", detail: "Head to review to approve the note" },
];

export function GeneratePage() {
  const router = useRouter();
  const [patients, setPatients] = useState<User[]>([]);
  const [patientId, setPatientId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [phaseIdx, setPhaseIdx] = useState(-1);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    api.myPatients().then(setPatients);
  }, []);

  useEffect(() => {
    if (!runId) return;
    const seq: Phase[] = ["uploading", "transcribing", "extracting", "validating", "done"];
    let i = 1;
    const iv = setInterval(() => {
      setPhaseIdx(i);
      setPhase(seq[i]);
      i++;
      if (i >= seq.length) clearInterval(iv);
    }, 1200);
    return () => clearInterval(iv);
  }, [runId]);

  const selectFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setError("");
  };

  const run = async () => {
    if (!patientId) {
      setError("Select a patient first.");
      return;
    }
    setError("");
    setPhaseIdx(0);
    setPhase("uploading");
    setRunId((n) => n + 1);
    try {
      const r = await api.generateReport({ patient_id: patientId, audio: file ?? undefined });
      setReport(r);
    } catch (e) {
      setPhase("idle");
      setPhaseIdx(-1);
      setError(e instanceof Error ? e.message : "Generation failed.");
    }
  };

  const goReview = () => {
    if (report) router.push(`/doctor/reports/${report.id}`);
  };

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="AI pipeline"
        title="Generate a clinical note"
        description="Upload a consultation recording. MediScribe transcribes it, extracts the clinical picture, validates medications, and drafts a SOAP note for your review."
      />

      {phase === "idle" && !report && (
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card className="p-6">
            <Field label="Patient">
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-line-strong bg-paper-light px-3.5 py-2.5 text-sm text-ink outline-none transition-all focus:border-leaf focus:ring-2 focus:ring-leaf/25"
              >
                <option value="">Select a patient…</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.email}
                  </option>
                ))}
              </select>
            </Field>
            {patients.length === 0 && (
              <p className="mt-2 text-xs text-clay-deep">
                No patients yet —{" "}
                <Link href="/doctor/patients?new=1" className="font-medium underline underline-offset-2">
                  add one first
                </Link>
                .
              </p>
            )}

            <div className="mt-6">
              <p className="mb-1.5 text-sm font-medium text-ink">Consultation audio</p>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  selectFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                  drag ? "border-leaf bg-leaf/5" : "border-line-strong hover:border-leaf/60"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-leaf/10 text-leaf">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden>
                        <path d="M12 2v9m0 0L8 7m4 4 4-4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p className="text-sm font-medium text-ink">{file.name}</p>
                    <p className="font-mono text-[11px] text-sage">
                      {formatDuration(Math.round(file.size / 48000))} · {(file.size / 1048576).toFixed(1)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs font-medium text-rose hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-pine/10 text-pine">
                      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
                        <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" strokeLinecap="round" />
                      </svg>
                    </span>
                    <p className="text-sm text-ink">
                      <span className="font-semibold text-pine">Drop your audio here</span> or click to browse
                    </p>
                    <p className="font-mono text-[11px] text-sage">M4A · MP3 · WAV — demo accepts any file</p>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <p className="mt-2 text-xs text-sage">
                No audio handy? You can still generate — the demo uses a built-in sample consultation.
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                {error}
              </p>
            )}

            <div className="mt-6">
              <Button full size="lg" onClick={run} disabled={!patientId}>
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M10 1.5 11.8 7l5.7 1.8-5.7 1.8L10 16.5 8.2 10.6 2.5 8.8 8.2 7 10 1.5z" />
                </svg>
                Generate draft
              </Button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-sage">
                AI-generated · doctor-reviewed · never auto-approved
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            {PHASES.filter((p) => p.key !== "done").map((p) => (
              <Card key={p.key} className="flex items-start gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-pine/10 text-pine">
                  <PhaseIcon phase={p.key as "transcribing" | "extracting" | "validating"} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.label}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{p.detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {phase !== "idle" && !report && (
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-semibold text-ink">Generating your draft</p>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-pine text-paper-light">
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              </span>
            </div>
            <div className="mt-8 space-y-2">
              {PHASES.filter((p) => p.key !== "done").map((p) => {
                const idx = PHASES.findIndex((x) => x.key === p.key);
                const state = phaseIdx > idx ? "done" : phaseIdx === idx ? "active" : "todo";
                return (
                  <div key={p.key} className="flex items-center gap-4 rounded-xl border border-line bg-paper px-4 py-3.5">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                        state === "done"
                          ? "border-leaf bg-leaf text-paper-light"
                          : state === "active"
                          ? "border-clay bg-clay/15 text-clay-deep"
                          : "border-line-strong bg-paper-light text-sage"
                      }`}
                    >
                      {state === "done" ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                          <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span>{String(idx + 1).padStart(2, "0")}</span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${state === "todo" ? "text-sage" : "text-ink"}`}>
                        {p.label}
                      </p>
                      {state === "active" && (
                        <p className="mt-0.5 text-xs text-clay-deep">{p.detail}</p>
                      )}
                    </div>
                    {state === "active" && (
                      <span className="h-2 w-2 rounded-full bg-clay animate-pulse-soft" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {report && phase === "done" && (
        <div className="mx-auto max-w-xl text-center">
          <Card className="p-10">
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-leaf/10 text-leaf">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8" aria-hidden>
                <path fillRule="evenodd" d="M12 3a9 9 0 100 18 9 9 0 000-18zm4.7 7.3a1 1 0 00-1.4-1.4L11 13.2l-2.3-2.3a1 1 0 10-1.4 1.4l3 3a1 1 0 001.4 0l5-5z" clipRule="evenodd" />
              </svg>
            </span>
            <h2 className="font-display text-2xl font-semibold text-ink">Draft generated</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              Your SOAP draft is ready. Review the extraction, fix anything the AI missed, then
              approve it so the patient can see the finalised note.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={goReview}>
                Review the draft
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/doctor/reports")}>
                View all reports
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}

function PhaseIcon({ phase }: { phase: "transcribing" | "extracting" | "validating" }) {
  const cls = "h-5 w-5";
  if (phase === "transcribing")
    return (
      <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0014 0M12 18v3" strokeLinecap="round" />
      </svg>
    );
  if (phase === "extracting")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
        <path d="M12 2l1.8 5.7L19.5 9.5 13.8 11.3 12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2zM19 16l.9 2.6 2.6.9-2.6.9L19 23l-.9-2.6-2.6-.9 2.6-.9L19 16z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cls} stroke="currentColor" strokeWidth="1.7">
      <path d="M4 12h5l1.5-4 3 8 1.5-4h5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  );
}
