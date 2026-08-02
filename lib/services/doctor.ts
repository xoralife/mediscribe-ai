import { http } from "@/lib/http";
import type { ContactMessage, CreatePatientPayload, DoctorProfileUpdate, User } from "@/lib/types";

export async function updateProfile(payload: DoctorProfileUpdate): Promise<User> {
  const { data } = await http.patch<User>("/doctor/profile", payload);
  return data;
}

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

export async function doctorMessages(unreadOnly = false): Promise<ContactMessage[]> {
  const { data } = await http.get<ContactMessage[]>("/doctor/messages", {
    params: unreadOnly ? { unread_only: true } : {},
  });
  return data;
}

export async function markMessageRead(messageId: string): Promise<ContactMessage> {
  const { data } = await http.patch<ContactMessage>(`/doctor/messages/${messageId}/read`);
  return data;
}
