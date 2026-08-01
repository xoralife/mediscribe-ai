"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/format";
import type { TranscriptSegment } from "@/lib/types";

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

  return (
    <div className="ruled space-y-4 rounded-2xl border border-line bg-paper-light p-5">
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
          <div>
            <p className={`font-mono text-[10px] font-medium uppercase tracking-wider ${speakerColor(seg.speaker)}`}>
              {seg.speaker}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-ink">{seg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
