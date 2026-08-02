import { http } from "@/lib/http";
import type { AppointmentHistoryItem, User } from "@/lib/types";

export async function appointmentHistory(patientId?: string): Promise<AppointmentHistoryItem[]> {
  const { data } = await http.get<AppointmentHistoryItem[]>(
    `/patient/history${patientId ? `?user_id=${patientId}` : ""}`
  );
  return data;
}

export async function patientDoctors(patientId?: string): Promise<User[]> {
  const query = patientId ? `?patient_id=${patientId}` : "";
  const { data } = await http.get<User[]>(`/patient/doctors${query}`);
  return data;
}
