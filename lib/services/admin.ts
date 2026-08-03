import { http } from "@/lib/http";
import type {
  AdminAnalytics,
  AdminDoctorCreate,
  AdminStats,
  AdminUser,
  AdminUserUpdate,
  ContactMessage,
  IntegrationsStatus,
  User,
} from "@/lib/types";

export async function pendingDoctors(): Promise<User[]> {
  const { data } = await http.get<User[]>("/admin/pending-doctors");
  return data;
}

export async function createDoctor(payload: AdminDoctorCreate): Promise<User> {
  const { data } = await http.post<User>("/admin/doctors", payload);
  return data;
}

export async function updateUser(
  userId: string,
  payload: AdminUserUpdate
): Promise<AdminUser> {
  const { data } = await http.patch<AdminUser>(`/admin/users/${userId}`, payload);
  return data;
}

export async function deleteUser(userId: string): Promise<void> {
  await http.delete(`/admin/users/${userId}`);
}

export async function adminStats(): Promise<AdminStats> {
  const { data } = await http.get<AdminStats>("/admin/stats");
  return data;
}

export async function adminUsers(): Promise<AdminUser[]> {
  const { data } = await http.get<AdminUser[]>("/admin/users");
  return data;
}

export async function adminIntegrations(): Promise<IntegrationsStatus> {
  const { data } = await http.get<IntegrationsStatus>("/admin/integrations");
  return data;
}

export async function adminAnalytics(): Promise<AdminAnalytics> {
  const { data } = await http.get<AdminAnalytics>("/admin/analytics");
  return data;
}

export async function promoteDoctor(userId: string): Promise<User> {
  const { data } = await http.patch<User>(`/admin/users/${userId}/promote-to-doctor`);
  return data;
}

export async function rejectDoctor(userId: string): Promise<void> {
  await http.delete(`/admin/users/${userId}/reject`);
}

export async function uploadUserAvatar(userId: string, file: File): Promise<AdminUser> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await http.post<AdminUser>(`/admin/users/${userId}/avatar`, form);
  return data;
}

export async function adminContactMessages(): Promise<ContactMessage[]> {
  const { data } = await http.get<ContactMessage[]>("/admin/contact-messages");
  return data;
}
