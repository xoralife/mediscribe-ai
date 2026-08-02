import type { TranscriptData, TranscriptSegment } from "@/lib/types";

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* Age in completed years from a YYYY-MM-DD date-of-birth, or null if absent/invalid. */
export function ageFromDob(dob?: string | null): number | null {
  if (!dob) return null;
  const b = new Date(dob);
  if (Number.isNaN(b.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export function formatDuration(sec?: number): string {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function initials(name: string): string {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* Resolve a backend media path (e.g. "/media/abc.mp3") to an absolute URL the
   browser can play. Plain absolute URLs are returned unchanged. */
export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    const origin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:8000";
    return `${origin}${url}`;
  }
  return url;
}

/* Normalize the backend transcript shape ({text, segments:[{speaker,start,end,text}]})
   or the mock shape (array of {speaker,time,text}) into TranscriptSegment[]. */
export function transcriptSegments(
  transcript?: TranscriptSegment[] | TranscriptData | null
): TranscriptSegment[] {
  if (!transcript) return [];
  const segments = Array.isArray(transcript) ? transcript : transcript.segments;
  if (!segments) return [];
  return segments
    .map((s) => ({
      speaker: s.speaker ?? "Speaker",
      time: (s as { time?: number }).time ?? (s as { start?: number }).start ?? 0,
      end: (s as { end?: number | null }).end ?? undefined,
      text: s.text ?? "",
      text_en: (s as { text_en?: string | null }).text_en ?? undefined,
      text_ur: (s as { text_ur?: string | null }).text_ur ?? undefined,
    }))
    .filter((s) => s.text);
}
