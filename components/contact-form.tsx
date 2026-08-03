"use client";

import React, { useState } from "react";

const SUBJECTS = [
  "General Inquiry",
  "Feature Request",
  "Technical Support",
  "Partnership Opportunity",
  "Demo Request",
  "Pricing Information",
];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (!form.subject) errs.subject = "Please select a subject";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 20) errs.message = "Message must be at least 20 characters";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="relative rounded-2xl border border-border bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center py-8">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-success/10 mb-5">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-success" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-semibold text-ink">Message Sent!</h3>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Thank you for reaching out. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
            className="mt-6 rounded-lg border border-border px-5 py-2 text-sm font-medium text-ink transition-all hover:border-brand hover:text-brand"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-ink">Send us a message</h3>
        <p className="mt-1 text-sm text-ink-soft">We typically respond within 24 hours.</p>
      </div>
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="10" cy="7" r="3" />
                  <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Jane Smith"
                className={`w-full rounded-lg border bg-surface-alt/30 py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.name ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
            </div>
            {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Email Address <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2" y="4" width="16" height="12" rx="2" />
                  <path d="M2 6l8 5 8-5" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@clinic.com"
                className={`w-full rounded-lg border bg-surface-alt/30 py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.email ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
            </div>
            {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Subject <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 6h12M4 10h8" strokeLinecap="round" />
                <path d="M4 14h5" strokeLinecap="round" />
              </svg>
            </span>
            <select
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className={`w-full appearance-none rounded-lg border bg-surface-alt/30 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-all ${errors.subject ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
            >
              <option value="" disabled>Select a topic...</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M5 8l5 5 5-5" />
              </svg>
            </span>
          </div>
          {errors.subject && <p className="text-xs text-danger">{errors.subject}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Message <span className="text-danger">*</span>
            </label>
            <span className="text-[10px] text-ink-muted">{form.message.length} / 500</span>
          </div>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={500}
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your needs or questions in detail..."
              className={`w-full rounded-lg border bg-surface-alt/30 py-2.5 px-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted resize-none ${errors.message ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
            />
          </div>
          {errors.message && <p className="text-xs text-danger">{errors.message}</p>}
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-xs text-ink-muted">
            <span className="text-danger">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-deep active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M3 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}