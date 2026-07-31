"use client";

import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { formatDate } from "@/lib/format";
import type { User } from "@/lib/types";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy,
  tone = "pine",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  tone?: "pine" | "clay" | "rose";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl bg-${tone}/10 text-${tone}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
              <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
            </svg>
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
            {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "rose" ? "danger" : "primary"} loading={busy} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [resolve, setResolve] = useState<(v: boolean) => void>(() => {});
  const confirm = (): Promise<boolean> =>
    new Promise((r) => { setResolve(r); setOpen(true); });
  const accept = () => { setOpen(false); resolve(true); };
  const decline = () => { setOpen(false); resolve(false); };
  return { open, confirm, accept, decline };
}
