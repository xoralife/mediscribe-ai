"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/format";
import type { TranscriptSegment } from "@/lib/types";

type DisplayLang = "original" | "en" | "ur";

const LANG_OPTIONS: { value: DisplayLang; label: string }[] = [
  { value: "original", label: "As spoken (Romanized)" },
  { value: "en", label: "English" },
  { value: "ur", label: "اردو (Urdu)" },
];

export function Transcript({
  segments,
  playing,
  activeIndex,
}: {
  segments: TranscriptSegment[];
  playing?: boolean;
  activeIndex?: number | null;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [lang, setLang] = useState<DisplayLang>("original");

  useEffect(() => {
    if (activeIndex !== undefined) {
      setActive(activeIndex);
      return;
    }
    if (!playing) {
      setActive(null);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      setActive(i % segments.length);
      i++;
    }, 2200);
    return () => clearInterval(iv);
  }, [playing, segments.length, activeIndex]);

  const speakerColor = (s: string) =>
    s.toLowerCase().includes("doctor") ? "text-pine" : "text-clay-deep";

  const displayText = (seg: TranscriptSegment) => {
    if (lang === "en") return seg.text_en ?? seg.text;
    if (lang === "ur") return seg.text_ur ?? seg.text;
    return seg.text;
  };

  return (
    <div className="ruled space-y-4 rounded-2xl border border-line bg-paper-light p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">
          Diarized transcript
        </p>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as DisplayLang)}
          className="appearance-none rounded-lg border border-line-strong bg-paper-light px-2.5 py-1.5 font-mono text-[10px] text-ink outline-none transition-all focus:border-leaf focus:ring-2 focus:ring-leaf/25"
        >
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`flex gap-3 rounded-lg p-2 transition-all ${
            active === i ? "bg-leaf/10 ring-1 ring-leaf/25" : ""
          }`}
        >
          <span className="mt-0.5 shrink-0 font-mono text-[10px] text-sage tabular-nums">
            {formatDuration(seg.time)}
          </span>
          <div className="min-w-0">
            <p className={`font-mono text-[10px] font-medium uppercase tracking-wider ${speakerColor(seg.speaker)}`}>
              {seg.speaker}
            </p>
            <p
              dir={lang === "ur" ? "rtl" : "ltr"}
              className={`mt-0.5 text-sm leading-relaxed ${lang === "ur" ? "font-serif text-[15px] text-ink" : "text-ink"}`}
            >
              {displayText(seg)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
