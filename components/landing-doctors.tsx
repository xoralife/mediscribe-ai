"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { initials } from "@/lib/format";
import { errorMessage } from "@/lib/http";
import type { PublicDoctor } from "@/lib/types";
import { Button, Field, Input } from "@/components/ui";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  age: string;
  message: string;
}

const EMPTY: ContactForm = { name: "", email: "", phone: "", age: "", message: "" };

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function LandingDoctors() {
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contact, setContact] = useState<PublicDoctor | null>(null);
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api
      .publicDoctors()
      .then((d) => {
        if (active) setDoctors(d);
      })
      .catch(() => {
        if (active) setError("The doctor directory couldn't be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const openContact = (doc: PublicDoctor) => {
    setContact(doc);
    setForm(EMPTY);
    setSent(false);
    setError("");
  };

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();
    const age = form.age.trim();
    if (!name || !email || !phone || !message) {
      setError("Please fill in your name, email, phone number and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setError("Please enter a valid phone number (7–20 digits, may start with +).");
      return;
    }
    if (age && (!/^\d+$/.test(age) || Number(age) < 1 || Number(age) > 120)) {
      setError("Please enter an age between 1 and 120.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await api.sendContactMessage({
        doctor_id: contact.id,
        name,
        email,
        phone,
        age: age || null,
        message,
      });
      setSent(true);
    } catch (err) {
      setError(errorMessage(err, "Couldn't send the message. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="doctors" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">
            Our doctors
          </p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            Meet the clinicians on the platform.
          </h2>
        </div>
        <div className="rounded-2xl border border-line bg-paper-light px-5 py-3 shadow-soft">
          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">
            {loading ? "Loading…" : `${doctors.length} doctor${doctors.length === 1 ? "" : "s"} available`}
          </p>
          <p className="mt-0.5 font-display text-3xl font-semibold text-pine">
            {loading ? "…" : doctors.length}
          </p>
        </div>
      </div>

      {error && !loading && (
        <p className="mt-6 rounded-xl border border-rose/25 bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-line bg-paper-light px-5 py-10 text-center text-sm text-ink-soft">
          No doctors have joined yet — check back soon.
        </p>
      ) : (
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc) => {
            const expanded = expandedId === doc.id;
            return (
              <div
                key={doc.id}
                className={`rounded-2xl border bg-paper-light shadow-soft transition-all duration-300 ${
                  expanded
                    ? "border-leaf/40 shadow-lift md:col-span-2 lg:col-span-3"
                    : "cursor-pointer border-line hover:-translate-y-1 hover:border-leaf/40 hover:shadow-lift"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : doc.id)}
                  aria-expanded={expanded}
                  className={`flex w-full items-center gap-4 text-left ${expanded ? "px-6 pt-6" : "p-5"}`}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pine/10 font-display text-base font-semibold text-pine">
                    {initials(doc.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg font-semibold text-ink">
                      {doc.name}
                    </span>
                    <span className="block truncate font-mono text-[11px] uppercase tracking-wider text-sage">
                      {doc.specialization || "General Practice"}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`h-4 w-4 shrink-0 text-sage transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden
                  >
                    <path d="M4 7l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {expanded && (
                  <div className="animate-fade-up border-t border-line px-6 py-5">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Full name</p>
                          <p className="mt-1 text-sm font-medium text-ink">{doc.name}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Specialization</p>
                          <p className="mt-1 text-sm font-medium text-ink">{doc.specialization || "General Practice"}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Email</p>
                          <p className="mt-1 break-all text-sm font-medium text-ink">{doc.email}</p>
                        </div>
                      </div>
                      <Button size="lg" onClick={() => openContact(doc)}>
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                          <path d="M3 7l7 5 7-5M4 5h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Contact Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Contact modal */}
      {contact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Contact ${contact.name}`}
        >
          <div
            className="absolute inset-0 bg-pine-deep/50 backdrop-blur-sm"
            onClick={() => setContact(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-paper-light p-6 shadow-lift animate-fade-up">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">Contact {contact.name}</h3>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-sage">
                  {contact.specialization || "General Practice"}
                </p>
              </div>
              <button
                onClick={() => setContact(null)}
                className="text-sage transition-colors hover:text-ink"
                aria-label="Close"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-5 text-center animate-fade-in">
                <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-8 w-8 text-leaf" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-3 font-medium text-pine">Message sent</p>
                <p className="mt-1 text-sm text-pine/80">
                  Thanks {form.name.trim()} — {contact.name.split(" ")[0]} will get back to you soon.
                </p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setContact(null)}>
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={submitContact} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Age">
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      step={1}
                      placeholder="Your age"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email">
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Phone number" hint="Required">
                    <Input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Message">
                  <textarea
                    rows={4}
                    placeholder={`Ask ${contact.name} a question…`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none rounded-lg border border-line-strong bg-paper-light px-3.5 py-2.5 text-sm text-ink placeholder:text-sage outline-none transition-all focus:border-leaf focus:ring-2 focus:ring-leaf/25"
                  />
                </Field>
                {error && (
                  <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                    {error}
                  </p>
                )}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <Button type="button" variant="ghost" onClick={() => setContact(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={sending}>
                    {sending ? "Sending…" : "Send message"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
