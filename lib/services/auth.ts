import { http, isNetworkError } from "@/lib/http";
import type { AuthResponse, AuthSession, LoginPayload, RegisterPayload, User } from "@/lib/types";
import { loadSession, saveSession } from "@/lib/token";

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  const token = data.access_token;
  const user = await me(token).catch(() => null);
  const session: AuthSession = { token, user: user! };
  // A pending doctor must NOT get a session — they can't use the platform yet.
  if (user?.role !== "pending_doctor") {
    saveSession(session);
  }
  return session;
}

export async function register(payload: RegisterPayload): Promise<{ user_id: string; role: string }> {
  const { data } = await http.post<AuthResponse>("/auth/register", payload);
  // No session is created — the doctor waits for admin approval, then signs in.
  return { user_id: data.user_id ?? "", role: data.role ?? "pending_doctor" };
}

export async function requestPermission(): Promise<User> {
  const { data } = await http.post<User>("/auth/request-permission");
  return data;
}

export async function me(token?: string): Promise<User> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const { data } = await http.get<User>("/auth/me", config);
  return data;
}

export async function uploadAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append("file", file);
  // Don't set Content-Type manually — axios detects FormData and adds the multipart boundary itself.
  const { data } = await http.post<User>("/doctor/profile/avatar", form);
  return data;
}

export async function restoreSession(): Promise<AuthSession | null> {
  const stored = loadSession();
  if (!stored) return null;
  try {
    const user = await me(stored.token);
    const session: AuthSession = { token: stored.token, user };
    saveSession(session);
    return session;
  } catch (e) {
    if (isNetworkError(e)) return stored;
    throw e;
  }
}
