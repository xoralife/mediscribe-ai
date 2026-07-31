import { http } from "@/lib/http";
import type { HealthStatus } from "@/lib/types";

export async function getHealth(): Promise<HealthStatus> {
  const ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:8000";
  const { data } = await http.get<HealthStatus>("health", {
    baseURL: ORIGIN,
  });
  return data;
}
