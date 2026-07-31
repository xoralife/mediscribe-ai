import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { Report, User } from "@/lib/types";

export async function myReports(userId?: string): Promise<Report[]> {
  const { data } = await http.get<Report[]>(`/patient/reports${userId ? `?user_id=${userId}` : ""}`);
  return data;
}

export async function patientDoctors(patientId?: string): Promise<User[]> {
  const query = patientId ? `?patient_id=${patientId}` : "";
  const { data } = await http.get<User[]>(`/patient/doctors${query}`);
  return data;
}
