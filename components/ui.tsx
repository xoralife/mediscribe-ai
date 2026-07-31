import { forwardRef } from "react";

/* Button */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", full, loading, className = "", children, disabled, ...rest }, ref) => {
    const variants: Record<string, string> = {
      primary:
        "bg-pine text-paper-light hover:bg-leaf border border-pine hover:border-leaf shadow-soft",
      dark: "bg-ink text-paper-light hover:bg-pine-deep border border-ink",
      outline:
        "bg-transparent text-ink border border-line-strong hover:border-leaf hover:text-leaf",
      ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-cream",
      danger: "bg-rose text-paper-light hover:opacity-90 border border-rose",
    };
    const sizes: Record<string, string> = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
        {...rest}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

/* Field (label + input) */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-line-strong bg-paper-light px-3.5 py-2.5 text-sm text-ink placeholder:text-sage outline-none transition-all focus:border-leaf focus:ring-2 focus:ring-leaf/25 ${className}`}
      {...rest}
    />
  )
);
Input.displayName = "Input";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint && <span className="font-mono text-[10px] uppercase tracking-wider text-sage">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/* Badge */

export function Badge({
  tone = "pine",
  children,
  dot,
}: {
  tone?: "pine" | "clay" | "rose" | "sage" | "ink";
  dot?: boolean;
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    pine: "bg-leaf/12 text-leaf border-leaf/25",
    clay: "bg-clay/12 text-clay-deep border-clay/30",
    rose: "bg-rose/10 text-rose border-rose/25",
    sage: "bg-sage/15 text-ink-soft border-sage/30",
    ink: "bg-ink/6 text-ink border-ink/15",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${tones[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />}
      {children}
    </span>
  );
}

/* Card */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-paper-light shadow-soft ${className}`}
    >
      {children}
    </div>
  );
}

/* Section title for app pages */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-leaf">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/* Empty state */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-paper-light/60 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-leaf">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
