import { http } from "@/lib/http";
import type {
  AdminAnalytics,
  AdminStats,
  AdminUser,
  IntegrationsStatus,
  User,
} from "@/lib/types";

export async function pendingDoctors(): Promise<User[]> {
  const { data } = await http.get<User[]>("/admin/pending-doctors");
  return data;
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
