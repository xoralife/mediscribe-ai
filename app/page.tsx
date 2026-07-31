import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#roles", label: "For clinics" },
];

const HERO_IMG =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1600&auto=format&fit=crop";
const TEAM_IMG =
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop";
const REVIEW_IMG =
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1200&auto=format&fit=crop";
const PATIENT_IMG =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop";

export default function LandingPage() {
  return (
    <div className="paper-texture flex-1">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-leaf"
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
              className="rounded-lg bg-pine px-4 py-2 text-sm font-medium text-paper-light shadow-soft transition-all hover:bg-leaf active:scale-[0.98]"
            >
              Try the demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="dotted-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-leaf/25 bg-leaf/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-leaf animate-fade-in"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-soft" />
              Human-in-the-loop · AI-assisted clinical notes
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem] animate-fade-up">
              Conversations in,
              <br />
              <em className="text-pine">clinical notes</em> out.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg animate-fade-up">
              MediScribe listens to your consultation, drafts a structured SOAP note with
              Generative AI, validates every medication against RxNorm, and hands the pen back to
              you — nothing reaches the patient until you approve it.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-pine px-6 py-3.5 text-sm font-semibold text-paper-light shadow-lift transition-all hover:bg-leaf hover:shadow-lift active:scale-[0.98]"
              >
                Start with a demo account
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                  <path d="M3 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-paper-light/60 px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:border-leaf hover:text-leaf"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider text-sage animate-fade-in">
              <span>Mistral ASR</span>
              <span className="h-1 w-1 rounded-full bg-sage/50" />
              <span>Gemini 3.6 Flash</span>
              <span className="h-1 w-1 rounded-full bg-sage/50" />
              <span>RxNorm validated</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-up lg:pl-6">
            <div className="relative overflow-hidden rounded-3xl border border-line shadow-lift">
              <Image
                src={HERO_IMG}
                alt="Doctor reviewing a patient consultation"
                width={1200}
                height={1000}
                className="h-[420px] w-full object-cover sm:h-[520px]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-paper-light/90 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-pine font-display text-xs font-semibold text-paper-light">S</span>
                    <span className="text-xs font-medium text-ink">Subjective</span>
                  </div>
                  <span className="rounded-full border border-leaf/25 bg-leaf/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-leaf">Draft · v2</span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  Patient reports 3 weeks of fatigue and morning occipital headaches, with
                  lightheadedness on standing.
                </p>
              </div>
            </div>

            {/* floating badge */}
            <div className="absolute -left-4 top-8 hidden rotate-[-3deg] rounded-2xl border border-line bg-paper-light px-4 py-3 shadow-lift sm:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Medications</p>
              <p className="mt-1 font-mono text-sm text-ink">
                Amlodipine 5mg <span className="text-leaf">✓</span>
              </p>
              <p className="font-mono text-sm text-ink">
                Lisinopril 10mg <span className="text-leaf">✓</span>
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-sage">RxNorm matched</p>
            </div>

            <div className="absolute -right-3 bottom-40 hidden rotate-[2.5deg] rounded-2xl border border-line bg-paper-light px-4 py-3 shadow-lift sm:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sage">Speaker diarization</p>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pine" />
                  <span className="font-mono text-xs text-ink">Doctor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-clay" />
                  <span className="font-mono text-xs text-ink">Patient</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-line bg-pine-deep py-3.5 text-paper-light">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-ticker gap-10 pr-10 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-light/80">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex shrink-0 gap-10">
                {["Audio → Diarized transcript", "Gemini structured extraction", "RxNorm medication check", "Doctor review & approve", "Patient access"].map((t) => (
                  <span key={t} className="flex items-center gap-10">
                    {t}
                    <span className="text-clay">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">The pipeline</p>
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          From spoken word to a finished medical record.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              t: "Record & upload",
              d: "The consultation audio is uploaded securely. No patient data leaves until the doctor says so.",
            },
            {
              n: "02",
              t: "Transcribe with diarization",
              d: "Mistral ASR separates speakers, so the note always knows who said what.",
            },
            {
              n: "03",
              t: "Extract clinically",
              d: "Gemini 3.6 Flash builds symptoms, diagnosis, medications and a full SOAP note — with confidence flags.",
            },
            {
              n: "04",
              t: "Review, approve, share",
              d: "You edit the draft, approve it, and only then can the patient see it — plus a clean PDF export.",
            },
          ].map((s, i) => (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-line bg-paper-light/70 p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="font-display text-4xl font-medium text-sage/40 transition-colors group-hover:text-leaf/60">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-line bg-cream/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">Built for trust</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            AI that drafts. A doctor who decides.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                t: "Approve-before-share gate",
                d: "A report is a draft until the doctor signs it. Patients only ever see approved, finalised notes.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 12h5l1.5-4 3 8 1.5-4h5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
                  </svg>
                ),
                t: "RxNorm medication checks",
                d: "Every drug and dose is cross-checked against NIH RxNorm, with local fallback so the demo never breaks.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 5H5a1 1 0 00-1 1v4m2-1v8M15 5h4a1 1 0 011 1v4M7 15v4a1 1 0 001 1h4m8-9v5a1 1 0 01-1 1h-4" strokeLinecap="round" />
                  </svg>
                ),
                t: "Editable SOAP editor",
                d: "Drafts are fully editable field by field. You own the final note — the AI just does the typing.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
                  </svg>
                ),
                t: "Speaker-aware transcripts",
                d: "Review the exact conversation with doctor and patient clearly separated and time-stamped.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" strokeLinejoin="round" />
                    <path d="M14 3v6h6M9 13h6M9 17h4" strokeLinecap="round" />
                  </svg>
                ),
                t: "One-click PDF export",
                d: "Finalised reports export to a clean clinical PDF, ready to file or share with the patient.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.6">
                    <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" strokeLinejoin="round" />
                    <path d="M9 12h6M12 9v6" strokeLinecap="round" />
                  </svg>
                ),
                t: "Defense in depth",
                d: "JWT role guards at the API plus row-level security — patients can never cross into another's data.",
              },
            ].map((f, i) => (
              <div
                key={f.t}
                className="rounded-2xl border border-line bg-paper-light p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-pine/10 text-pine">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">Three perspectives</p>
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          One platform, the right view for every role.
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            {
              img: TEAM_IMG,
              role: "Doctor",
              accent: "text-pine",
              points: ["Upload a recording, get a draft", "Edit and approve in one screen", "Manage your own patient list"],
              link: { href: "/register", label: "Join as a doctor" },
            },
            {
              img: REVIEW_IMG,
              role: "Admin",
              accent: "text-clay-deep",
              points: ["Approve new doctors", "No patient access — by design", "Keep the clinic safe"],
              link: { href: "/login", label: "Open admin view" },
            },
            {
              img: PATIENT_IMG,
              role: "Patient",
              accent: "text-leaf",
              points: ["See only your own records", "Read-only, approved notes", "Download your PDF"],
              link: { href: "/login", label: "Open patient view" },
            },
          ].map((c) => (
            <div
              key={c.role}
              className="group overflow-hidden rounded-2xl border border-line bg-paper-light shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={c.img}
                  alt={c.role}
                  width={800}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent" />
                <span className={`absolute bottom-3 left-4 font-display text-xl font-semibold text-paper-light ${c.accent}`}>
                  {c.role}
                </span>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-ink-soft">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden>
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  href={c.link.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pine transition-colors hover:text-leaf"
                >
                  {c.link.label}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M3 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="ink-texture relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="dotted-grid pointer-events-none absolute inset-0 opacity-10" />
          <p className="relative mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-sage">
            Hackathon demo · fully offline-ready
          </p>
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-paper-light sm:text-5xl">
            Type less. Listen more.{" "}
            <em className="text-clay">Approve with confidence.</em>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-sm leading-relaxed text-paper-light/70 sm:text-base">
            Every account in the demo uses password{" "}
            <code className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-paper-light">
              demo1234
            </code>{" "}
            — jump in as a doctor, approve a draft, then switch to the patient view.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-paper-light px-7 py-3.5 text-sm font-semibold text-ink shadow-lift transition-all hover:bg-cream active:scale-[0.98]"
            >
              Start the demo
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-paper-light transition-all hover:border-white/40 hover:bg-white/5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-paper-light/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
          <Logo />
          <p className="font-mono text-[11px] uppercase tracking-wider text-sage">
            Generative AI Track · Hackathon 2026
          </p>
          <p className="text-xs text-ink-soft">
            For demonstration only — no real patient data.
          </p>
        </div>
      </footer>
    </div>
  );
}
