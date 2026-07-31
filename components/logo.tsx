import Link from "next/link";

export function Logo({
  dark = false,
  size = "md",
}: {
  dark?: boolean;
  size?: "sm" | "md";
}) {
  const sz = size === "md" ? "h-9 w-9" : "h-8 w-8";
  const text = size === "md" ? "text-lg" : "text-base";
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={`${sz} relative grid place-items-center rounded-xl border transition-transform duration-300 group-hover:-rotate-3 ${
          dark
            ? "border-white/15 bg-white/10 text-paper-light"
            : "border-line-strong bg-pine text-paper-light"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" aria-hidden>
          <path
            d="M4 12h5l1.5-4 3 8 1.5-4h5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="6" r="1.4" fill="currentColor" />
        </svg>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-clay transition-transform duration-300 group-hover:scale-125" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${text} font-display font-semibold tracking-tight ${
            dark ? "text-paper-light" : "text-ink"
          }`}
        >
          MediScribe
        </span>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.28em] ${
            dark ? "text-sage" : "text-sage"
          }`}
        >
          AI · Clinical Notes
        </span>
      </span>
    </Link>
  );
}
