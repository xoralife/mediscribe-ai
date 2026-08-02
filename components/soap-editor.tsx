"use client";

import type { Extraction } from "@/lib/types";

const SOAP_KEYS: { key: keyof Extraction["soap"]; label: string; title: string }[] = [
  { key: "subjective", label: "S", title: "Subjective" },
  { key: "objective", label: "O", title: "Objective" },
  { key: "assessment", label: "A", title: "Assessment" },
  { key: "plan", label: "P", title: "Plan" },
];

function ArrayEditor({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">{label}</p>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-mono text-xs text-sage">{String(i + 1).padStart(2, "0")}</span>
            <input
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              className="w-full rounded-lg border border-line-strong bg-paper-light px-3 py-2 text-sm text-ink outline-none transition-all focus:border-leaf focus:ring-2 focus:ring-leaf/25"
            />
            <button
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-line-strong px-2 py-1.5 text-xs text-sage hover:border-rose hover:text-rose"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => onChange([...values, ""])}
          className="rounded-lg border border-dashed border-line-strong px-3 py-2 text-xs font-medium text-sage transition-colors hover:border-leaf hover:text-leaf"
        >
          + Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

export function SOAPEditor({
  extraction,
  onChange,
}: {
  extraction: Extraction;
  onChange: (e: Extraction) => void;
}) {
  const set = (patch: Partial<Extraction>) => onChange({ ...extraction, ...patch });
  const setSoap = (key: keyof Extraction["soap"], value: string) =>
    onChange({ ...extraction, soap: { ...extraction.soap, [key]: value } });

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">SOAP Note</p>
        <div className="grid gap-3 md:grid-cols-2">
          {SOAP_KEYS.map((s) => (
            <label key={s.key} className="block rounded-xl border border-line bg-paper-light p-4">
              <span className="mb-2 flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-pine font-display text-sm font-semibold text-paper-light">
                  {s.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage">{s.title}</span>
              </span>
              <textarea
                value={extraction.soap[s.key]}
                onChange={(e) => setSoap(s.key, e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg bg-transparent text-sm leading-relaxed text-ink outline-none placeholder:text-sage"
              />
            </label>
            
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ArrayEditor label="Symptoms" values={extraction.symptoms} onChange={(v) => set({ symptoms: v })} placeholder="Symptom" />
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Medications</p>
            <div className="space-y-3">
              {extraction.medications.map((m, i) => (
                <div key={i} className="rounded-lg border border-line-strong bg-paper-light p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-sage">{String(i + 1).padStart(2, "0")}</span>
                    <input
                      value={m.name}
                      onChange={(e) => {
                        const meds = [...extraction.medications];
                        meds[i] = { ...m, name: e.target.value };
                        set({ medications: meds });
                      }}
                      placeholder="Medication name"
                      className="w-full rounded-lg border border-line-strong bg-paper-light px-3 py-2 text-sm text-ink outline-none focus:border-leaf"
                    />
                    <button
                      onClick={() => set({ medications: extraction.medications.filter((_, j) => j !== i) })}
                      className="shrink-0 rounded-lg border border-line-strong px-2 py-1.5 text-xs text-sage hover:border-rose hover:text-rose"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      value={m.dosage}
                      onChange={(e) => {
                        const meds = [...extraction.medications];
                        meds[i] = { ...m, dosage: e.target.value };
                        set({ medications: meds });
                      }}
                      placeholder="Dosage"
                      className="w-full rounded-lg border border-line-strong bg-paper-light px-3 py-2 text-sm text-ink outline-none focus:border-leaf"
                    />
                    <input
                      value={m.frequency}
                      onChange={(e) => {
                        const meds = [...extraction.medications];
                        meds[i] = { ...m, frequency: e.target.value };
                        set({ medications: meds });
                      }}
                      placeholder="Frequency"
                      className="w-full rounded-lg border border-line-strong bg-paper-light px-3 py-2 text-sm text-ink outline-none focus:border-leaf"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set({ medications: [...extraction.medications, { name: "", dosage: "", frequency: "" }] })}
                className="rounded-lg border border-dashed border-line-strong px-3 py-2 text-xs font-medium text-sage transition-colors hover:border-leaf hover:text-leaf"
              >
                + Add medication
              </button>
            </div>
          </div>
          <ArrayEditor label="Medical History" values={extraction.medical_history} onChange={(v) => set({ medical_history: v })} placeholder="History item" />
          <ArrayEditor label="Diagnosis" values={extraction.diagnosis} onChange={(v) => set({ diagnosis: v })} placeholder="Diagnosis" />
        </div>
        <div className="space-y-6">
          <ArrayEditor label="Recommendations" values={extraction.recommendations} onChange={(v) => set({ recommendations: v })} placeholder="Recommendation" />
          <ArrayEditor label="Follow-up Points" values={extraction.follow_up_points} onChange={(v) => set({ follow_up_points: v })} placeholder="Follow-up" />
        </div>
      </div>
    </div>
  );
}
