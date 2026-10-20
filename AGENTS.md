<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MediScribe AI — Frontend

Next.js landing page + role dashboards (doctor / patient / admin). Talks to the
FastAPI backend in `../MediScribe`.

## Public contact form — intent routing

The landing-page contact form (`components/contact-form.tsx`) lets the sender
declare **who they are**, and the backend routes the message accordingly:

| Option | Payload | Backend | Lands in |
|---|---|---|---|
| "I'm a patient" | `intent: "patient_to_doctor"`, `doctor_email`, `subject?`, `age?` | resolves the email to an approved doctor | that doctor's inbox |
| "I'm a doctor" | `intent: "doctor_to_us"`, `specialization`, `subject?` | no doctor attached | admin inbox |

- `doctor_email` is what the patient types; the backend resolves it to a
  `doctor_id`. A non-existent or non-doctor email comes back as `404` and the
  form shows the backend's message.
- `components/landing-doctors.tsx` (the inline "Contact now" form under each
  doctor) posts `intent: "patient_to_doctor"` with the known `doctor_id`.
- `components/admin-dashboard.tsx` splits the inbox into **Doctor applications**
  (`intent === "doctor_to_us"`, with an "Onboard as doctor" action that creates a
  real doctor account via `api.adminCreateDoctor`) and **Patient enquiries**.
- `components/doctor-messages.tsx` shows only the messages addressed to that
  doctor, with the subject displayed.

Type contract lives in `lib/types.ts` (`ContactIntent`, `ContactMessageCreate`,
`ContactMessage`). `ContactMessageCreate.age` is a **number**, and
`ContactMessage.doctor_id` is **nullable**.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build
npx tsc --noEmit # type check
```

The backend must be running on `:8000` — see `../MediScribe/README.md` for the
Windows event-loop caveat (`python -m app.server`).

