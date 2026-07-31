import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { User } from "@/lib/types";

export async function listPatients(ownerId?: string): Promise<User[]> {
  const { data } = await http.get<User[]>(`/doctor/patients${ownerId ? `?owner_id=${ownerId}` : ""}`);
  return data;
}

export async function createPatient(payload: { name: string; email: string; dob: string; owner_id?: string }): Promise<User> {
  const { data } = await http.post<User>("/doctor/patients", payload);
  return data;
}

export async function searchPatients(query: string): Promise<User[]> {
  const { data } = await http.get<User[]>("/doctor/patients/search", { params: { q: query } });
  return data;
}
