"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AdminAnalytics } from "@/lib/types";

const PINE = "#1e4a39";
const LEAF = "#2e6b4f";
const CLAY = "#c4762c";
const CLAY_DEEP = "#a05e1f";
const SAGE = "#7a9588";
const LINE = "#e2dccc";
const LINE_STRONG = "#d3cbb4";
const PAPER = "#fbf9f2";
const INK = "#15241e";

function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

const axisTick = {
  fill: SAGE,
  fontSize: 10,
  fontFamily: "var(--font-plex), monospace",
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line-strong bg-paper-light px-4 py-3 shadow-lift">
      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((p) => (
          <p key={p.name} className="flex items-center justify-between gap-6 font-mono text-xs text-ink">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .adminAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <AppShell nav={NAV.admin} roleLabel="Admin">
      <PageHeader
        eyebrow="Admin console"
        title="Analytics"
        description="Report generation trends, user growth, and doctor activity across the platform."
      />

      {loading && !data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : error && !data ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink-soft">{error}</p>
        </Card>
      ) : data ? (
        <>
          {/* Metric cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Total reports" value={data.totals.reports} />
            <Metric label="Approval rate" value={`${data.approval_rate}%`} accent="clay" />
            <Metric label="Approved" value={data.totals.approved_reports} sub="ready for patients" />
            <Metric label="Drafts" value={data.totals.draft_reports} sub="awaiting review" accent="sage" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Reports trend */}
            <ChartCard
              title="Report generation"
              note="last 14 days · generated vs approved"
              legend={[
                { label: "Generated", color: LEAF },
                { label: "Approved", color: CLAY },
              ]}
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.reports_over_time} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={LINE} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: LINE_STRONG, strokeDasharray: "4 4" }} />
                  <Line type="monotone" dataKey="generated" stroke={LEAF} strokeWidth={2.5} dot={{ r: 3, fill: LEAF, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="approved" stroke={CLAY} strokeWidth={2.5} dot={{ r: 3, fill: CLAY, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* User growth */}
            <ChartCard
              title="User growth"
              note="last 14 days · cumulative accounts"
              legend={[
                { label: "Doctors", color: PINE },
                { label: "Patients", color: CLAY },
              ]}
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.users_over_time} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={LINE} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: LINE_STRONG, strokeDasharray: "4 4" }} />
                  <Line type="monotone" dataKey="doctors" stroke={PINE} strokeWidth={2.5} dot={{ r: 3, fill: PINE, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="patients" stroke={CLAY} strokeWidth={2.5} dot={{ r: 3, fill: CLAY, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Reports by doctor */}
          <div className="mt-6">
            <ChartCard
              title="Reports by doctor"
              note="total vs approved per doctor"
              legend={[
                { label: "Total", color: LEAF },
                { label: "Approved", color: CLAY_DEEP },
              ]}
            >
              <ResponsiveContainer width="100%" height={Math.max(120, data.reports_by_doctor.length * 56)}>
                <BarChart data={data.reports_by_doctor} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={LINE} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="doctor_name" width={130} tick={{ ...axisTick, fill: INK }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f4f1e8" }} />
                  <Bar dataKey="total" fill={LEAF} radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="approved" fill={CLAY_DEEP} radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}

function Metric({
  label,
  value,
  sub,
  accent = "pine",
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "pine" | "clay" | "sage";
}) {
  const tones: Record<string, string> = {
    pine: "text-leaf",
    clay: "text-clay-deep",
    sage: "text-sage",
  };
  return (
    <Card className="p-5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{label}</p>
      <p className={`mt-2 font-display text-4xl font-semibold tracking-tight ${tones[accent]}`}>{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-sage">{sub}</p>}
    </Card>
  );
}

function ChartCard({
  title,
  note,
  legend,
  children,
}: {
  title: string;
  note: string;
  legend: Array<{ label: string; color: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">{note}</p>
        </div>
        <div className="flex items-center gap-3">
          {legend.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      {children}
    </Card>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Admin only</h1>
      <p className="mt-2 text-sm text-ink-soft">You don't have permission to view this page.</p>
    </div>
  );
}
