import type { AuthSession } from "./types";

const SESSION_KEY = "mediscribe_session_v1";

/* Centralised session/token store shared by the real HTTP layer and the mock. */

export function getToken(): string | null {
  return loadSession()?.token ?? null;
}

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveSession(s: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

export function clearSession() {
  saveSession(null);
}
