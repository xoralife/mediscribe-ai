"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, initials, relativeTime } from "@/lib/format";
import type { User } from "@/lib/types";

const patientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's full name"),
  email: z.string().trim().email("Enter a valid email address"),
  dob: z.string().min(1, "Enter a date of birth"),
});
type PatientForm = z.infer<typeof patientSchema>;

export function PatientsPage() {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

  const load = async () => {
    setLoading(true);
    setPatients(await api.myPatients());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      setSearchResults(await api.searchPatients(q));
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const create = async (values: PatientForm) => {
    setError("");
    setBusy(true);
    try {
      await api.createPatient(values);
      setPatients(await api.myPatients());
      setTempPassword("demo1234");
      setSearch("");
      setSearchResults([]);
      reset();
      setShowNew(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create patient.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="Patient management"
        title="Your patients"
        description="Patients can only be invited by a doctor — there is no public self-registration."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search patients…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-48 pr-8"
              />
              {searching && (
                <svg className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-sage" viewBox="0 0 20 20" fill="none">
                  <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 10a8 8 0 018-8V0C5.4 0 0 5.4 0 10h4z" />
                </svg>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={load}>
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 mr-1" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 10a6 6 0 0111.3-2.8M16 10a6 6 0 01-11.3 2.8" strokeLinecap="round" />
                <path d="M17 3v4h-4M3 17v-4h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Refresh
            </Button>
            <Button onClick={() => setShowNew(true)}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Invite
            </Button>
          </div>
        }
      />

      {showNew && (
        <div className="mb-8 rounded-2xl border border-line bg-paper-light p-6 shadow-lift animate-fade-up">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-ink">New patient</h3>
            <button onClick={() => setShowNew(false)} className="text-sage hover:text-ink">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit(create)} className="grid gap-4 sm:grid-cols-3" noValidate>
            <Field label="Full name">
              <Input autoComplete="name" placeholder="Patient name" aria-invalid={!!errors.name} {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-rose">{errors.name.message}</p>}
            </Field>
            <Field label="Email">
              <Input type="email" autoComplete="email" placeholder="patient@email.com" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-rose">{errors.email.message}</p>}
            </Field>
            <Field label="Date of birth">
              <Input type="date" aria-invalid={!!errors.dob} {...register("dob")} />
              {errors.dob && <p className="mt-1 text-xs text-rose">{errors.dob.message}</p>}
            </Field>
            {error && (
              <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose sm:col-span-3">
                {error}
              </p>
            )}
            <div className="flex items-center justify-end gap-3 sm:col-span-3">
              <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={busy}>
                Create & invite
              </Button>
            </div>
          </form>
        </div>
      )}

      {tempPassword && (
        <div className="mb-8 rounded-2xl border border-leaf/30 bg-leaf/10 p-5 animate-fade-up">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-leaf" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="font-medium text-pine">Patient invited</p>
              <p className="mt-1 text-sm text-pine/80">
                Share these credentials offline with the patient — in a real deployment an email
                invite would be sent instead.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <code className="rounded-lg border border-leaf/25 bg-paper-light px-3 py-1.5 font-mono text-sm text-ink">
                  {tempPassword}
                </code>
                <span className="font-mono text-[11px] uppercase tracking-wider text-sage">
                  temporary password
                </span>
              </div>
              <button
                onClick={() => setTempPassword("")}
                className="mt-3 text-xs font-medium text-pine underline underline-offset-2 hover:text-leaf"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : search.trim() ? (
        searchResults.length === 0 ? (
          <EmptyState
            title="No matches"
            description={`No patients matched "${search}". Try a different name or email.`}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((p) => (
              <Card key={p.id} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf/10 font-display text-base font-semibold text-leaf">
                    {initials(p.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-ink">{p.name}</p>
                    <p className="truncate text-xs text-ink-soft">{p.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                    DOB {p.dob ? formatDate(p.dob) : "—"}
                  </span>
                  <Badge tone="pine">Active</Badge>
                </div>
                <p className="mt-2 font-mono text-[10px] text-sage">Invited {relativeTime(p.created_at)}</p>
              </Card>
            ))}
          </div>
        )
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients yet"
          description="Invite your first patient to begin building their consultation records."
          action={
            <Button onClick={() => setShowNew(true)}>Invite your first patient</Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((p) => (
            <Card key={p.id} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-leaf/10 font-display text-base font-semibold text-leaf">
                  {initials(p.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-ink">{p.name}</p>
                  <p className="truncate text-xs text-ink-soft">{p.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                  DOB {p.dob ? formatDate(p.dob) : "—"}
                </span>
                <Badge tone="pine">Active</Badge>
              </div>
              <p className="mt-2 font-mono text-[10px] text-sage">Invited {relativeTime(p.created_at)}</p>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
