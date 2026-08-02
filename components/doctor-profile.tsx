"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell, NAV } from "@/components/app-shell";
import { Button, Card, Field, Input, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { initials, resolveMediaUrl } from "@/lib/format";
import { errorMessage } from "@/lib/http";

export function DoctorProfile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setSpecialization(user.specialization ?? "");
  }, [user]);

  if (!user) return null;

  const dirty =
    name.trim() !== user.name || specialization.trim() !== (user.specialization ?? "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name can't be empty.");
      return;
    }
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const updated = await api.updateDoctorProfile({
        name: name.trim(),
        specialization: specialization.trim(),
      });
      updateUser({ ...user, ...updated });
      setSaved(true);
    } catch (err) {
      setError(errorMessage(err, "Couldn't save your profile. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const pickAvatar = (f: File | null) => {
    if (!f) return;
    setAvatarBusy(true);
    setError("");
    api
      .uploadAvatar(f)
      .then((updated) => {
        updateUser({ ...user, ...updated });
        setSaved(true);
      })
      .catch((err) => setError(errorMessage(err, "Couldn't upload the photo.")))
      .finally(() => setAvatarBusy(false));
  };

  const avatar = user.avatar_url ? resolveMediaUrl(user.avatar_url) : null;

  return (
    <AppShell nav={NAV.doctor} roleLabel="Doctor">
      <PageHeader
        eyebrow="Profile"
        title="Your profile"
        description="These details appear on the public website directory and on your reports."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={user.name}
                  className="mx-auto h-24 w-24 rounded-full border-4 border-brand-light object-cover"
                />
              ) : (
                <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-light text-2xl font-semibold text-brand">
                  {initials(user.name)}
                </span>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                title="Change profile photo"
                disabled={avatarBusy}
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-white text-ink-soft shadow-sm transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {avatarBusy ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                    <path d="M7 3h6l1.5 2H16a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0116 16H4a1.5 1.5 0 01-1.5-1.5v-8A1.5 1.5 0 014 5h1.5L7 3zm3 3a4 4 0 100 8 4 4 0 000-8zm0 1.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
                  </svg>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => pickAvatar(e.target.files?.[0] ?? null)}
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-ink">{user.name}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-ink-muted">
              {user.specialization || "General Practice"}
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 text-xs font-medium text-brand hover:text-brand-deep"
            >
              Upload photo
            </button>
          </div>
          <div className="mt-5 border-t border-border pt-4 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Email</p>
            <p className="mt-1 break-all text-sm font-medium text-ink">{user.email}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Role</p>
            <p className="mt-1 text-sm font-medium capitalize text-ink">{user.role}</p>
          </div>
        </Card>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Edit details</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Update your public name and specialization. Your email is your login and can't be
            changed here.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <Field label="Full name">
              <Input
                placeholder="Dr. Jane Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
              />
            </Field>
            <Field label="Specialization" hint="Shown on the public doctors directory">
              <Input
                placeholder="e.g. Cardiology"
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setSaved(false);
                }}
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-rose/25 bg-rose/10 px-3 py-2 text-sm text-rose">
                {error}
              </p>
            )}
            {saved && (
              <p className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand-deep animate-fade-in">
                Profile saved — the public directory now shows your updated details.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <Button
                type="button"
                variant="ghost"
                disabled={!dirty || saving}
                onClick={() => {
                  setName(user.name);
                  setSpecialization(user.specialization ?? "");
                  setError("");
                  setSaved(false);
                }}
              >
                Reset
              </Button>
              <Button type="submit" loading={saving} disabled={!dirty}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
