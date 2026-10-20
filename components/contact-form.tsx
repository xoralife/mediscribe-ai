"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/http";

/* What the sender wants to do. This decides where the message is routed:
   a patient enquiry goes to the doctor they name, a registration request goes
   to the admin inbox. */
type Intent = "patient" | "doctor";

const TOPICS = [
  "Appointment request",
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
  phone: string;
  doctorEmail: string;
  age: string;
  specialization: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  doctorEmail: "",
  age: "",
  specialization: "",
  subject: "",
  message: "",
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s-]{10,}$/;

export default function ContactForm() {
  const [intent, setIntent] = useState<Intent>("patient");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Invalid email address";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!PHONE_RE.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
    if (!form.message.trim()) errs.message = "Message is required";
    else if (form.message.trim().length < 20) errs.message = "Message must be at least 20 characters";

    if (intent === "patient") {
      if (!form.doctorEmail.trim()) errs.doctorEmail = "Enter the doctor's email address";
      else if (!EMAIL_RE.test(form.doctorEmail.trim()))
        errs.doctorEmail = "Enter a valid email address";
      if (form.age.trim() && !/^\d+$/.test(form.age.trim()))
        errs.age = "Enter an age between 1 and 120";
      else if (form.age.trim() && (Number(form.age) < 1 || Number(form.age) > 120))
        errs.age = "Enter an age between 1 and 120";
    } else {
      if (!form.specialization.trim()) errs.specialization = "Specialization is required";
    }
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const switchIntent = (next: Intent) => {
    setIntent(next);
    setErrors({});
    setSubmitError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      if (intent === "patient") {
        await api.sendContactMessage({
          intent: "patient_to_doctor",
          doctor_email: form.doctorEmail.trim(),
          subject: form.subject || null,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          age: form.age ? Number(form.age) : null,
          message: form.message.trim(),
        });
      } else {
        await api.sendContactMessage({
          intent: "doctor_to_us",
          subject: form.subject || null,
          specialization: form.specialization.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        });
      }
      setSent(true);
    } catch (err) {
      setSubmitError(errorMessage(err, "Failed to send message. Please try again."));
    } finally {
      setLoading(false);
    }
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
          <h3 className="font-display text-xl font-semibold text-ink">
            {intent === "patient" ? "Message sent!" : "Request received!"}
          </h3>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            {intent === "patient"
              ? `Your message was sent to ${form.doctorEmail.trim()}. They will get back to you soon.`
              : "Thanks for reaching out. Our admin will review your request and contact you to complete your registration."}
          </p>
          <button
            onClick={() => {
              setSent(false);
              setForm(EMPTY_FORM);
            }}
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
        <p className="mt-1 text-sm text-ink-soft">Tell us who you are and we'll route it to the right desk.</p>
      </div>

      {/* Intent switch — decides where the message is delivered. */}
      <div role="radiogroup" aria-label="Who are you contacting us as?" className="mb-6 grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              key: "patient" as const,
              title: "I'm a patient",
              blurb: "Reach a specific doctor",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 21c0-3.9 3.6-6 8-6s8 2.1 8 6" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              key: "doctor" as const,
              title: "I'm a doctor",
              blurb: "Apply to join the platform",
              icon: (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ]
        ).map((opt) => {
          const active = intent === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => switchIntent(opt.key)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                active
                  ? "border-brand bg-brand-light/50 ring-2 ring-brand/20"
                  : "border-border bg-surface-alt/30 hover:border-border-strong"
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-brand text-white" : "bg-surface-alt text-ink-muted"
                }`}
              >
                {opt.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{opt.title}</span>
                <span className="mt-0.5 block text-xs text-ink-soft">{opt.blurb}</span>
              </span>
            </button>
          );
        })}
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        {intent === "patient" && (
          <div className="space-y-1.5">
            <label htmlFor="doctorEmail" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Doctor&apos;s email address <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2" y="4" width="16" height="12" rx="2" />
                  <path d="M2 6l8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                id="doctorEmail"
                name="doctorEmail"
                type="email"
                value={form.doctorEmail}
                onChange={handleChange}
                placeholder="doctor@clinic.com"
                className={`w-full rounded-lg border bg-surface-alt/30 py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.doctorEmail ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
            </div>
            <p className="text-xs text-ink-muted">Your message goes straight to this doctor&apos;s inbox.</p>
            {errors.doctorEmail && <p className="text-xs text-danger">{errors.doctorEmail}</p>}
          </div>
        )}

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
                placeholder={intent === "patient" ? "Jane Smith" : "Dr. Jane Smith"}
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
                  <path d="M2 6l8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Phone Number <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4h4l1.5 3.5-2 1.2c.8 1.5 2 2.5 3.5 3l1.2-2L15 12h4V4c0-1-.5-2-2-3-4-1-6-1-9 3-1.5 1.5-2 4-1 6l1 1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className={`w-full rounded-lg border bg-surface-alt/30 py-2.5 pl-10 pr-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.phone ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
            </div>
            {errors.phone && <p className="text-xs text-danger">{errors.phone}</p>}
          </div>

          {intent === "patient" ? (
            <div className="space-y-1.5">
              <label htmlFor="age" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Age <span className="text-ink-muted">(optional)</span>
              </label>
              <input
                id="age"
                name="age"
                type="text"
                inputMode="numeric"
                value={form.age}
                onChange={handleChange}
                placeholder="35"
                className={`w-full rounded-lg border bg-surface-alt/30 px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.age ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
              {errors.age && <p className="text-xs text-danger">{errors.age}</p>}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label htmlFor="specialization" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Specialization <span className="text-danger">*</span>
              </label>
              <input
                id="specialization"
                name="specialization"
                type="text"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Cardiology"
                className={`w-full rounded-lg border bg-surface-alt/30 px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted ${errors.specialization ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
              />
              {errors.specialization && <p className="text-xs text-danger">{errors.specialization}</p>}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Subject <span className="text-ink-muted">(optional)</span>
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
              className="w-full appearance-none rounded-lg border border-border-strong bg-surface-alt/30 py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Select a topic...</option>
              {TOPICS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M5 8l5 5 5-5" />
              </svg>
            </span>
          </div>
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
              placeholder={
                intent === "patient"
                  ? "Describe your symptoms or the reason for your visit..."
                  : "Tell us about your practice and how you'd use MediScribe..."
              }
              className={`w-full rounded-lg border bg-surface-alt/30 px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-muted resize-none ${errors.message ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border-strong focus:border-brand focus:ring-brand/20"} focus:ring-2`}
            />
          </div>
          {errors.message && <p className="text-xs text-danger">{errors.message}</p>}
        </div>

        {submitError && (
          <div className="rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
            {submitError}
          </div>
        )}

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
                {intent === "patient" ? "Send to Doctor" : "Send Request"}
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
