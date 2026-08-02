"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateTime, relativeTime } from "@/lib/format";
import type { ContactMessage } from "@/lib/types";

export function DoctorMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setMessages(await api.doctorMessages());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load your messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (m: ContactMessage) => {
    try {
      const updated = await api.markMessageRead(m.id);
      setMessages((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      /* non-critical — leave as is */
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="Messages"
        title="Contact messages"
        description="Messages sent to you from the public website contact form."
        actions={
          <Button variant="outline" onClick={load}>
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 mr-1" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 10a6 6 0 0111.3-2.8M16 10a6 6 0 01-11.3 2.8" strokeLinecap="round" />
              <path d="M17 3v4h-4M3 17v-4h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </Button>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-paper-light text-clay-deep shadow-soft">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 8l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            {loading ? "…" : unread > 0 ? `${unread} unread` : "No unread messages"}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">
            {loading ? "Loading…" : `${messages.length} total`}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-rose/25 bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="When someone sends a message from the website's Contact Now form, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card
              key={m.id}
              className={`p-5 transition-all ${!m.read ? "border-clay/40 shadow-lift" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay/10 font-display text-sm font-semibold text-clay-deep">
                    {m.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                      {!m.read && <Badge tone="clay" dot>New</Badge>}
                    </div>
                    <p className="truncate text-xs text-ink-soft">
                      {m.email} · <a href={`tel:${m.phone}`} className="font-medium text-pine hover:underline">{m.phone}</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div className="hidden sm:block">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Received</p>
                    <p className="text-xs font-medium text-ink" title={formatDateTime(m.created_at)}>
                      {relativeTime(m.created_at)}
                    </p>
                  </div>
                  {m.age != null && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Age</p>
                      <p className="font-mono text-xs font-medium text-ink">{m.age}</p>
                    </div>
                  )}
                  {!m.read && (
                    <Button size="sm" variant="outline" onClick={() => markRead(m)}>
                      Mark read
                    </Button>
                  )}
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl border border-line bg-cream/50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
                {m.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
