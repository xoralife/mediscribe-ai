import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { Extraction, GenerateReportPayload, Report } from "@/lib/types";

export async function generateReport(payload: GenerateReportPayload): Promise<Report> {
  const fd = new FormData();
  fd.append("patient_id", payload.patient_id);
  if (payload.audio) fd.append("audio", payload.audio);
  const { data } = await http.post<Report>("/generate-report", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getReport(id: string): Promise<Report> {
  const { data } = await http.get<Report>(`/records/${id}`);
  return data;
}

export async function updateReport(id: string, extraction: Extraction): Promise<Report> {
  const { data } = await http.patch<Report>(`/records/${id}`, { extraction_json: extraction });
  return data;
}

export async function approveReport(id: string): Promise<Report> {
  const { data } = await http.post<Report>(`/records/${id}/approve`);
  return data;
}

export async function downloadReportPdf(id: string): Promise<Blob> {
  const { data } = await http.get<Blob>(`/records/${id}/pdf`, { responseType: "blob" });
  return data;
}
