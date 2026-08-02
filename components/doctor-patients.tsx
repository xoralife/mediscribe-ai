"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppShell, NAV } from "@/components/app-shell";
import { Badge, Button, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";
import { ageFromDob, formatDate, initials, relativeTime } from "@/lib/format";
import type { User } from "@/lib/types";

const patientSchema = z.object({
  name: z.string().trim().min(2, "Enter the patient's full name"),
  email: z.string().trim().email("Enter a valid email address"),
  dob: z.string().min(1, "Enter a date of birth"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type PatientForm = z.infer<typeof patientSchema>;

export function PatientsPage() {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setSuccess(`Patient created — share the login password you set with ${values.name}.`);
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

  const exportCsv = () => {
    const rows = [["Name", "Email", "Date of Birth", "Registered"]];
    const list = search.trim() && searchResults.length ? searchResults : patients;
    for (const p of list) {
      rows.push([p.name, p.email, p.dob ? formatDate(p.dob) : "", formatDate(p.created_at)]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const list = search.trim() ? searchResults : patients;

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Patients</h1>
          <p className="mt-2 text-sm text-ink-soft">Manage your patient records</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Patient
        </Button>
      </div>

      {/* Add Patient modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" onClick={() => setShowNew(false)}>
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lift animate-fade-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Add New Patient"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">Add New Patient</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Enter the patient's information to create a new record
                </p>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-alt hover:text-ink" aria-label="Close">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit(create)} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
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
                <Field label="Password">
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Set their login password"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  {errors.password && <p className="mt-1 text-xs text-rose">{errors.password.message}</p>}
                </Field>
              </div>
              {error && (
                <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                  {error}
                </p>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={busy}>
                  Add Patient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-brand/30 bg-brand/10 p-4 animate-fade-up">
          <div className="flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-brand" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-brand-deep">Patient created</p>
              <p className="mt-1 text-sm text-ink-soft">{success}</p>
            </div>
            <button onClick={() => setSuccess("")} className="text-xs font-medium text-brand underline underline-offset-2 hover:text-brand-deep">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="relative w-full max-w-xs">
            <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" />
              <path d="M13.5 13.5L17 17" strokeLinecap="round" />
            </svg>
            <Input
              type="search"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
            {searching && (
              <svg className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-ink-muted" viewBox="0 0 20 20" fill="none">
                <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 10a8 8 0 018-8V0C5.4 0 0 5.4 0 10h4z" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
              </svg>
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                <path d="M10 2v10m0 0l-3.5-3.5M10 12l3.5-3.5M3 14v3h14v-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Date of Birth</th>
                <th className="px-4 py-3">Registration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-sm text-ink-soft">Loading patients…</td>
                </tr>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-10 w-10 text-border-strong" stroke="currentColor" strokeWidth="1.2">
                      <path d="M12 3a5 5 0 015 5c0 2.5-1.5 3.8-1.5 5h-7C8.5 11.8 7 10.5 7 8a5 5 0 015-5zM10 17h4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-3 font-medium text-ink">No patients found.</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {search.trim() ? "Try a different search." : "Add a new patient to get started."}
                    </p>
                    {!search.trim() && (
                      <Button className="mt-4" onClick={() => setShowNew(true)}>Add New Patient</Button>
                    )}
                  </td>
                </tr>
              ) : (
                list.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-alt">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-light text-xs font-semibold text-brand">
                          {initials(p.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-ink-muted">Age {ageFromDob(p.dob) != null ? ageFromDob(p.dob) : "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{p.email}</td>
                    <td className="px-4 py-3 text-ink-soft">{p.dob ? formatDate(p.dob) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-soft">{relativeTime(p.created_at)}</span>
                        <Badge tone="pine">Active</Badge>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
