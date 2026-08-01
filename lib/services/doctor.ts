import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { CreatePatientPayload, User } from "@/lib/types";

export async function listPatients(): Promise<User[]> {
  const { data } = await http.get<User[]>("/doctor/patients");
  return data;
}

export async function createPatient(payload: CreatePatientPayload): Promise<User> {
  const { data } = await http.post<User>("/doctor/patients", payload);
  return data;
}

export async function searchPatients(query: string): Promise<User[]> {
  const { data } = await http.get<User[]>("/doctor/patients/search", { params: { q: query } });
  return data;
}
