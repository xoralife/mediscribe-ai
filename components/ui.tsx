import { forwardRef } from "react";

/* ── Button ── */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", full, loading, className = "", children, disabled, ...rest }, ref) => {
    const variants: Record<string, string> = {
      primary: "bg-brand text-white hover:bg-brand-deep shadow-sm",
      accent: "bg-accent text-white hover:bg-accent-deep shadow-sm",
      dark: "bg-ink text-white hover:bg-slate-800 shadow-sm",
      outline:
        "bg-white text-ink border border-border-strong hover:border-brand hover:text-brand shadow-sm",
      ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-surface-alt",
      danger: "bg-danger text-white hover:bg-rose-700 shadow-sm",
    };
    const sizes: Record<string, string> = {
      sm: "text-xs px-3 py-1.5 gap-1.5 rounded-md",
      md: "text-sm px-4 py-2 gap-2 rounded-lg",
      lg: "text-sm px-6 py-3 gap-2 rounded-lg font-semibold",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
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

/* ── Input ── */

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...rest }, ref) => (
    <input
      ref={ref}
      className={`w-full rounded-lg border border-border-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none transition-all duration-150 focus:border-brand focus:ring-2 focus:ring-brand/20 ${className}`}
      {...rest}
    />
  )
);
Input.displayName = "Input";

/* ── Field ── */

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
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/* ── Badge ── */

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
    pine: "bg-brand/10 text-brand border-brand/20",
    clay: "bg-warning-bg text-warning border-warning/30",
    rose: "bg-danger-bg text-danger border-danger/25",
    sage: "bg-surface-alt text-ink-soft border-border",
    ink: "bg-slate-100 text-ink border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tones[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />}
      {children}
    </span>
  );
}

/* ── Card ── */

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border border-border bg-white shadow-card ${className}`}>
      {children}
    </div>
  );
}

/* ── Page header ── */

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
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/* ── Empty state ── */

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
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border-strong bg-white px-6 py-16 text-center">
      {icon && <div className="mb-4 text-brand">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
