import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";
import { LandingDoctors } from "@/components/landing-doctors";
import ContactForm from "@/components/contact-form";

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#doctors", label: "Our doctors" },
  { href: "#contact", label: "Contact" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-brand"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-deep active:scale-[0.98]"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-light/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
              AI-assisted clinical notes
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-[3.9rem] animate-fade-up">
              Conversations in,
              <br />
              <span className="text-brand">clinical notes</span> out.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg animate-fade-up">
              MediScribe listens to your consultation, drafts a structured SOAP note with
              Generative AI, validates every medication against RxNorm, and hands the pen back to
              you — nothing reaches the patient until you approve it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4 animate-fade-up">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-deep hover:shadow-lg active:scale-[0.98]"
              >
                Register as a doctor
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M3 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-white px-7 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:border-brand hover:text-brand"
              >
                Sign in
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 grid max-w-md grid-cols-3 gap-4">
              {[
                { icon: "🔒", label: "Approve-before-share" },
                { icon: "💊", label: "RxNorm validated" },
                { icon: "🤖", label: "AI + human review" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-alt text-base">
                    {t.icon}
                  </span>
                  <span className="text-xs font-medium leading-tight text-ink-soft">{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-up lg:pl-6">
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop"
                alt="Doctor reviewing a patient consultation"
                width={1200}
                height={1000}
                className="h-[420px] w-full object-cover sm:h-[520px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-white/90 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs font-bold text-white">S</span>
                    <span className="text-xs font-semibold text-ink">Subjective</span>
                  </div>
                  <span className="rounded-full border border-brand/25 bg-brand-light px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    Draft · v2
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  Patient reports 3 weeks of fatigue and morning occipital headaches, with
                  lightheadedness on standing.
                </p>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -left-4 top-10 hidden rotate-[-3deg] rounded-xl border border-border bg-white px-4 py-3 shadow-lg sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Medications</p>
              <p className="mt-1 font-mono text-sm text-ink">
                Amlodipine 5mg <span className="text-success">✓</span>
              </p>
              <p className="font-mono text-sm text-ink">
                Lisinopril 10mg <span className="text-success">✓</span>
              </p>
              <p className="mt-0.5 text-[10px] text-ink-muted">RxNorm matched</p>
            </div>

            <div className="absolute -right-3 bottom-44 hidden rotate-[2.5deg] rounded-xl border border-border bg-white px-4 py-3 shadow-lg sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Speaker diarization</p>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  <span className="font-mono text-xs text-ink">Doctor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  <span className="font-mono text-xs text-ink">Patient</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-border bg-ink">
        <div className="flex overflow-hidden py-3.5">
          <div className="flex shrink-0 animate-ticker gap-10 pr-10 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex shrink-0 gap-10">
                {["Audio → Diarized transcript", "Gemini structured extraction", "RxNorm medication check", "Doctor review & approve", "Patient access"].map((t) => (
                  <span key={t} className="flex items-center gap-10">
                    {t}
                    <span className="text-brand">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand">The pipeline</p>
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          From spoken word to a finished medical record.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { n: "01", t: "Record & upload", d: "The consultation audio is uploaded securely. No patient data leaves until the doctor says so." },
            { n: "02", t: "Transcribe with diarization", d: "Mistral ASR separates speakers, so the note always knows who said what." },
            { n: "03", t: "Extract clinically", d: "Gemini 3.6 Flash builds symptoms, diagnosis, medications and a full SOAP note — with confidence flags." },
            { n: "04", t: "Review, approve, share", d: "You edit the draft, approve it, and only then can the patient see it — plus a clean PDF export." },
          ].map((s, i) => (
            <div
              key={s.n}
              className="group relative rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="font-display text-4xl font-medium text-ink-muted/30 transition-colors group-hover:text-brand/50">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-surface-alt/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand">Built for trust</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            AI that drafts. A doctor who decides.
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                t: "Approve-before-share gate", d: "A report is a draft until the doctor signs it. Patients only ever see approved, finalised notes.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 12h5l1.5-4 3 8 1.5-4h5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                  </svg>
                ),
                t: "RxNorm medication checks", d: "Every drug and dose is cross-checked against NIH RxNorm, with local fallback so the demo never breaks.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 5H5a1 1 0 00-1 1v4m2-1v8M15 5h4a1 1 0 011 1v4M7 15v4a1 1 0 001 1h4m8-9v5a1 1 0 01-1 1h-4" strokeLinecap="round" />
                  </svg>
                ),
                t: "Editable SOAP editor", d: "Drafts are fully editable field by field. You own the final note — the AI just does the typing.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
                  </svg>
                ),
                t: "Speaker-aware transcripts", d: "Review the exact conversation with doctor and patient clearly separated and time-stamped.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" strokeLinejoin="round" />
                    <path d="M14 3v6h6M9 13h6M9 17h4" strokeLinecap="round" />
                  </svg>
                ),
                t: "One-click PDF export", d: "Finalised reports export to a clean clinical PDF, ready to file or share with the patient.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l7 3v5c0 5-3 7.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                    <path d="M9 12h6M12 9v6" strokeLinecap="round" />
                  </svg>
                ),
                t: "Defense in depth", d: "JWT role guards at the API plus row-level security — patients can never cross into another's data.",
              },
            ].map((f, i) => (
              <div
                key={f.t}
                className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand/10 text-brand">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our doctors */}
      <LandingDoctors />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="ink-texture relative overflow-hidden rounded-2xl px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="dotted-grid pointer-events-none absolute inset-0 opacity-10" />
          <p className="relative mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Hackathon demo · fully offline-ready
          </p>
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            Type less. Listen more.{" "}
            <span className="text-brand">Approve with confidence.</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Register as a doctor, get approved by the admin, and start turning consultations into
            clean clinical notes.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-ink shadow-md transition-all hover:bg-surface active:scale-[0.98]"
            >
              Register now
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-brand">Get in touch</p>
            <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Ready to transform your clinical workflow?
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
              Have questions about MediScribe AI or want to request a specific feature? 
              Our team is here to help you integrate AI into your practice securely.
            </p>
            
            <div className="mt-10 space-y-5">
              {[
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 6 10-6" strokeLinecap="round" />
                    </svg>
                  ), 
                  label: "Email us", 
                  value: "hello@mediscribe.ai" 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  ), 
                  label: "Location", 
                  value: "Medical Tech Hub, Silicon Valley" 
                },
                { 
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" strokeLinecap="round" />
                    </svg>
                  ), 
                  label: "Support hours", 
                  value: "Mon – Fri, 9am – 6pm PST" 
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-alt text-brand">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{item.label}</p>
                    <p className="text-sm font-medium text-ink">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-border bg-surface-alt/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">Why reach out?</p>
              <ul className="space-y-2.5">
                {[
                  "Request a personalized demo for your clinic",
                  "Get technical support or onboarding help",
                  "Explore partnership opportunities",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.58l7.3-7.28a1 1 0 011.4 0z" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-brand/5 blur-2xl" />
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-alt/50">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-14 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
                AI-assisted clinical notes with a human-in-the-loop — nothing reaches the
                patient until the doctor approves it.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
                Generative AI Track · Hackathon 2026
              </p>
            </div>

            <nav aria-label="Platform">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">Platform</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { href: "#how", label: "How it works" },
                  { href: "#features", label: "Features" },
                  { href: "#doctors", label: "Our doctors" },
                  { href: "#contact", label: "Contact" },
                  { href: "/login", label: "Sign in" },
                  { href: "/register", label: "Try the demo" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-ink-soft transition-colors hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">Pipeline</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li>Mistral ASR · diarization</li>
                <li>Gemini 3.6 Flash extraction</li>
                <li>RxNorm medication check</li>
                <li>Doctor review & approve</li>
                <li>PDF export</li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-muted">Contact</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { role: "phone", email: "+923425624760" },
                  { role: "email", email: "abidhussainiou@gmail.com" },
                  { role: "address", email: "Agahadi Chowk, Skardu, Gilgit Baltistan" },
                ].map((a) => (
                  <li key={a.role}>
                    <p className="text-ink font-medium">{a.role}</p>
                    <p className="font-mono text-[11px] text-ink-soft">{a.email}</p>
                  </li>
                ))}
                <li className="pt-1 font-mono text-[11px] text-ink-muted"></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-ink-soft">
              © 2026 MediScribe AI — for demonstration only, no real patient data.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Conversations in · clinical notes out
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
