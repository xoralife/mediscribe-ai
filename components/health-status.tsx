"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { HealthStatus, User } from "@/lib/types";

export function HealthStatus(): React.JSX.Element {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .health()
      .then((h) => { setHealth(h); setError(""); })
      .catch(() => setError("Cannot reach backend"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid h-3 w-3 rounded-full ${loading ? "animate-pulse-soft bg-sage" : error ? "bg-rose" : "bg-leaf"}`} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-sage">Backend</span>
        </div>
        {loading && <span className="font-mono text-[10px] text-sage">Probing…</span>}
        {error && <Badge tone="rose">{error}</Badge>}
        {health && !error && (
          <Badge tone={health.status === "ok" ? "pine" : "clay"}>{health.status}</Badge>
        )}
      </div>
      {health?.message && <p className="mt-1 text-xs text-ink-soft">{health.message}</p>}
      {health?.database && <p className="mt-1 font-mono text-[10px] text-sage">DB: {health.database}</p>}
      <p className="mt-2 font-mono text-[10px] text-sage">Last checked {formatDate(new Date().toISOString())}</p>
    </Card>
  );
}

export function AdminHealthDashboard(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="System overview"
        title="Backend health"
        description="Real-time connection status of the MediScribe AI backend and external services."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <HealthStatus />
        <Card className="p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sage">Endpoints</p>
          <ul className="mt-3 space-y-2 font-mono text-xs text-ink-soft">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /health</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /auth/login</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /auth/me</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /admin/pending-doctors</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /doctor/patients</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /generate-report</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /records/{"/{id}"}</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> /patient/reports</li>
          </ul>
          <p className="mt-4 font-mono text-[10px] text-sage">Base: http://localhost:8000/api/v1</p>
        </Card>
      </div>
    </div>
  );
}
