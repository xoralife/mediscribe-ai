"use client";

import { useState } from "react";
import { Badge } from "@/components/ui";
import type { Extraction } from "@/lib/types";

const SOAP_KEYS: { key: keyof Extraction["soap"]; label: string; title: string }[] = [
  { key: "subjective", label: "S", title: "Subjective" },
  { key: "objective", label: "O", title: "Objective" },
  { key: "assessment", label: "A", title: "Assessment" },
  { key: "plan", label: "P", title: "Plan" },
];

export function ConfidenceStrip({ flags }: { flags: Extraction["confidence_flags"] }) {
  if (!flags?.length) return null;
  const tone = (l: string) => (l === "high" ? "pine" : l === "medium" ? "clay" : "rose");
  const label = (l: string) =>
    l === "high" ? "High" : l === "medium" ? "Review" : "Verify";
  return (
    <div className="space-y-2">
      {flags.map((f, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg border border-line bg-paper px-3 py-2">
          <Badge tone={tone(f.level) as "pine" | "clay" | "rose"} dot>
            {label(f.level)}
          </Badge>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{f.field}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{f.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChipList({ title, items, tone }: { title: string; items: string[]; tone?: "pine" | "clay" }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
              tone === "clay"
                ? "border-clay/30 bg-clay/10 text-clay-deep"
                : "border-line-strong bg-cream text-ink-soft"
            }`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function MedicationRow({ med }: { med: Extraction["medications"][number] }) {
  const tone = med.rxnorm_status === "valid" ? "pine" : med.rxnorm_status === "unrecognized" ? "rose" : "clay";
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-line bg-paper px-3.5 py-2.5">
      <div>
        <p className="text-sm font-medium text-ink">
          {med.name} <span className="font-normal text-ink-soft">— {med.dosage}</span>
        </p>
        <p className="mt-0.5 text-xs text-ink-soft">{med.frequency}</p>
      </div>
      {med.rxnorm_status && (
        <Badge tone={tone as "pine" | "clay" | "rose"}>{med.rxnorm_status}</Badge>
      )}
    </div>
  );
}

export function SOAPView({ extraction }: { extraction: Extraction }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
          SOAP Note
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOAP_KEYS.map((s) => (
            <div key={s.key} className="rounded-xl border border-line bg-paper-light p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-pine font-display text-sm font-semibold text-paper-light">
                  {s.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage">{s.title}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink">{extraction.soap[s.key]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <ChipList title="Symptoms" items={extraction.symptoms} />
          <ChipList title="Medical History" items={extraction.medical_history} />
          <ChipList title="Diagnosis" items={extraction.diagnosis} tone="clay" />
        </div>
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
              Medications
            </p>
            <div className="space-y-2">
              {extraction.medications.map((m, i) => (
                <MedicationRow key={i} med={m} />
              ))}
            </div>
          </div>
          <ChipList title="Recommendations" items={extraction.recommendations} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChipList title="Highlights" items={extraction.highlights} />
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
            Follow-up Points
          </p>
          <ul className="space-y-1.5">
            {extraction.follow_up_points.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
