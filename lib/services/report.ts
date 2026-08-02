import { http } from "@/lib/http";
import { resolveMediaUrl, transcriptSegments } from "@/lib/format";
import type { Extraction, GenerateReportPayload, Report } from "@/lib/types";

function audioNameFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const base = url.split("?")[0].split("/").pop();
    return base || null;
  } catch {
    return null;
  }
}

/* Convert a raw backend report payload into the shape the UI expects.
   The backend transcript_json is {text, segments:[{speaker,start,end,text}]}
   while the UI works with TranscriptSegment[] ({speaker,time,text}).
   The backend audio_url is a relative /media/... path — resolve it against
   the API origin so <audio> can play it. */
function normalizeReport(raw: Report): Report {
  const audio_name = raw.audio_name ?? audioNameFromUrl(raw.audio_url);
  return {
    ...raw,
    audio_name,
    audio_url: resolveMediaUrl(raw.audio_url),
    transcript_json: raw.transcript_json ? transcriptSegments(raw.transcript_json) : [],
  };
}

export async function generateReport(payload: GenerateReportPayload): Promise<Report> {
  const fd = new FormData();
  fd.append("patient_id", payload.patient_id);
  if (payload.audio) fd.append("audio", payload.audio);
  // No manual Content-Type — axios detects FormData and sets multipart with boundary.
  // The AI pipeline (Mistral → Gemini → RxNorm) can take minutes — don't let the
  // default 120s timeout kill it.
  const { data } = await http.post<Report>("/generate-report", fd, { timeout: 600000 });
  return normalizeReport(data);
}

export async function getReport(id: string): Promise<Report> {
  const { data } = await http.get<Report>(`/records/${id}`);
  return normalizeReport(data);
}

export async function listDoctorReports(): Promise<Report[]> {
  const { data } = await http.get<Report[]>("/doctor/reports");
  return data.map(normalizeReport);
}

export async function updateReport(id: string, extraction: Extraction): Promise<Report> {
  const { data } = await http.patch<Report>(`/records/${id}`, { extraction_json: extraction });
  return normalizeReport(data);
}

export async function approveReport(id: string): Promise<Report> {
  const { data } = await http.post<Report>(`/records/${id}/approve`);
  return normalizeReport(data);
}

export async function downloadReportPdf(id: string): Promise<Blob> {
  const { data } = await http.get<Blob>(`/records/${id}/pdf`, { responseType: "blob" });
  return data;
}
