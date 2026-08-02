"use client";

import { useEffect, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import type { AppointmentHistoryItem, User } from "@/lib/types";

export function PatientDashboard() {
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  const [doctor, setDoctor] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.appointmentHistory(), api.patientDoctors()]).then(([a, d]) => {
      setAppointments(a);
      setDoctor(d);
      setLoading(false);
    });
  }, []);

  const docName = doctor[0]?.name ?? "your doctor";

  return (
    <AppShell nav={NAV.patient} roleLabel="Patient">
      <PageHeader
        eyebrow="Patient portal"
        title="Appointment history"
        description={`A record of your consultations with ${docName} — the date, time and doctor for each visit.`}
      />

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="When you have a consultation with your doctor, it will appear here."
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <Card key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm3 6h2v2H8v-2zm4 0h2v2h-2v-2zm-4 4h2v2H8v-2zm4 0h2v2h-2v-2z" />
                  </svg>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">{formatDate(a.appointment_at)}</h3>
                    <Badge tone="pine" dot>Completed</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {formatDateTime(a.appointment_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Doctor
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">{a.doctor_name}</p>
                {a.specialization && (
                  <p className="mt-0.5 text-xs text-ink-soft">{a.specialization}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
