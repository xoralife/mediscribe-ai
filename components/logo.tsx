import Link from "next/link";

export function Logo({
  dark = false,
  size = "md",
}: {
  dark?: boolean;
  size?: "sm" | "md";
}) {
  const img = size === "md" ? "h-10 w-10" : "h-9 w-9";
  const text = size === "md" ? "text-lg" : "text-base";
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={`${img} relative grid shrink-0 place-items-center overflow-hidden rounded-xl transition-transform duration-300 group-hover:-rotate-3 ${
          dark ? "bg-white/10" : "bg-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/user-logo.png"
          alt="MediScribe AI"
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`${text} font-semibold tracking-tight ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          MediScribe
        </span>
        <span
          className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] ${
            dark ? "text-white/60" : "text-ink-muted"
          }`}
        >
          Your AI Doctor
        </span>
      </span>
    </Link>
  );
}
