import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { User } from "@/lib/types";

export async function pendingDoctors(): Promise<User[]> {
  const { data } = await http.get<User[]>("/admin/pending-doctors");
  return data;
}

export async function promoteDoctor(userId: string): Promise<User> {
  const { data } = await http.patch<User>(`/admin/users/${userId}/promote-to-doctor`);
  return data;
}
