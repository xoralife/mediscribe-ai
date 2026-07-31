import { http, isNetworkError, errorMessage } from "@/lib/http";
import type { AuthResponse, AuthSession, LoginPayload, RegisterPayload, User } from "@/lib/types";
import { loadSession, saveSession } from "@/lib/token";

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  const token = data.access_token;
  const user = await me(token).catch(() => null);
  const session: AuthSession = { token, user: user! };
  saveSession(session);
  return session;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await http.post<User>("/auth/register", payload);
  return data;
}

export async function me(token?: string): Promise<User> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const { data } = await http.get<User>("/auth/me", config);
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
