import type {
  AuthSession,
  CreatePatientPayload,
  Extraction,
  GenerateReportPayload,
  LoginPayload,
  RegisterPayload,
  Report,
  ReportStatus,
  TranscriptSegment,
  User,
} from "./types";

const DB_KEY = "mediscribe_db_v1";
const SESSION_KEY = "mediscribe_session_v1";

interface DB { users: User[]; reports: Report[]; }

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));
function fail(msg: string): never { throw new Error(msg); }

const seedTranscript: TranscriptSegment[] = [
  { speaker: "Doctor", time: 0, text: "Good morning, Ananya. I've seen your blood work come back. Let's talk through what's been happening." },
  { speaker: "Patient", time: 8, text: "Thank you, doctor. I've been feeling quite fatigued lately — it started about three weeks ago, and I've been getting headaches that just won't go away." },
  { speaker: "Doctor", time: 18, text: "Tell me more about the headaches. Where do you feel them, and do they come with anything else?" },
  { speaker: "Patient", time: 27, text: "Mostly at the back of my head, in the mornings. I also feel a bit dizzy when I stand up too quickly." },
  { speaker: "Doctor", time: 34, text: "Have you noticed any swelling in your hands or feet, or any change in how much you're urinating?" },
  { speaker: "Patient", time: 41, text: "My rings do feel tighter lately, and I have been using the washroom more frequently at night." },
  { speaker: "Doctor", time: 48, text: "Okay. Your blood pressure today is 158 over 96, and the urine test shows protein. I'd like to start you on a mild antihypertensive and a low-sodium diet." },
  { speaker: "Patient", time: 60, text: "That sounds fine. What about the fatigue?" },
  { speaker: "Doctor", time: 65, text: "That should improve once we get your pressure under control. I want a follow-up in two weeks, and a full kidney panel at that point." },
];

const seedExtraction: Extraction = {
  symptoms: ["Fatigue (3 weeks)", "Morning headaches — occipital", "Dizziness on standing", "Peripheral edema (ring tightness)", "Increased nocturia"],
  medical_history: ["No known prior hypertension", "No family history of renal disease", "Non-smoker"],
  diagnosis: ["Hypertension — stage 2 (158/96)", "Proteinuria — rule out early renal involvement"],
  medications: [
    { name: "Amlodipine", dosage: "5 mg", frequency: "once daily", rxnorm_status: "valid", rxnorm_note: "RxNorm: amlodipine besylate 5 mg" },
    { name: "Lisinopril", dosage: "10 mg", frequency: "once daily", rxnorm_status: "valid", rxnorm_note: "RxNorm: lisinopril 10 mg" },
  ],
  recommendations: ["Low-sodium diet (<2 g/day)", "Monitor BP twice daily at home", "Reduce caffeine intake"],
  soap: {
    subjective: "Patient reports 3 weeks of fatigue, morning occipital headaches, lightheadedness on standing, recent ring tightness and increased nocturia. Denies chest pain, palpitations, or vision changes.",
    objective: "BP 158/96 both arms. Urinalysis positive for protein. No ankle edema on exam; rings tight bilaterally. Heart sounds normal, no murmurs.",
    assessment: "Stage 2 hypertension with proteinuria concerning for early hypertensive renal involvement. Fatigue and headaches likely secondary to elevated BP.",
    plan: "Initiate amlodipine 5 mg + lisinopril 10 mg daily. Start low-sodium diet. Home BP log twice daily. Re-check BP and renal panel in 2 weeks. Escalate to nephrology if proteinuria worsens.",
  },
  highlights: ["New onset stage 2 hypertension", "Proteinuria present — renal involvement possible", "Good prognosis with early control"],
  follow_up_points: ["2-week follow-up with BP log", "Renal panel (creatinine, eGFR, urine protein/creatinine)", "Medication tolerance review"],
  confidence_flags: [{ field: "symptoms", level: "high", note: "Clear patient-reported timeline" }, { field: "diagnosis", level: "medium", note: "Hypertension confirmed by measurement; renal finding needs lab confirmation" }],
};

const seedDB = (): DB => ({ users: [
  { id: "u-admin", name: "Maya Krishnan", email: "admin@mediscribe.ai", role: "admin", is_approved: true, specialization: null, created_at: daysAgo(40) },
  { id: "u-dr", name: "Dr. Rohan Deshpande", email: "dr.rohan@mediscribe.ai", role: "doctor", is_approved: true, specialization: "Internal Medicine", created_at: daysAgo(30) },
  { id: "u-pending", name: "Dr. Priya Nair", email: "dr.priya@mediscribe.ai", role: "pending_doctor", is_approved: false, specialization: "Pediatrics", created_at: daysAgo(1) },
  { id: "u-patient", name: "Ananya Sharma", email: "ananya@mediscribe.ai", role: "patient", is_approved: true, specialization: null, doctor_id: "u-dr", dob: "1992-04-18", created_at: daysAgo(20) },
], reports: [{
  id: "r-1", patient_id: "u-patient", doctor_id: "u-dr", audio_name: "consult_ananya_01.m4a", duration_sec: 74, transcript_json: seedTranscript, extraction_json: seedExtraction, validation_flags: [{ medication: "Amlodipine", status: "valid", note: "RxNorm matched" }, { medication: "Lisinopril", status: "valid", note: "RxNorm matched" }], status: "approved", created_at: daysAgo(3), approved_at: daysAgo(2),
},{ id: "r-2", patient_id: "u-patient", doctor_id: "u-dr", audio_name: "followup_ananya_02.m4a", duration_sec: 52, transcript_json: [{ speaker: "Doctor", time: 0, text: "How have you been feeling since we started the medication?" }, { speaker: "Patient", time: 6, text: "Much better — the headaches are mostly gone. I still feel a little tired in the afternoons." }, { speaker: "Doctor", time: 14, text: "Your blood pressure log looks good, 132 over 84 average. Let's keep the same dose and repeat your labs in three months." }], extraction_json: { symptoms: ["Occasional afternoon fatigue"], medical_history: ["Stage 2 hypertension (diagnosed 3 weeks ago)"], diagnosis: ["Hypertension — controlled on current therapy"], medications: [{ name: "Amlodipine", dosage: "5 mg", frequency: "once daily", rxnorm_status: "valid", rxnorm_note: "RxNorm matched" }, { name: "Lisinopril", dosage: "10 mg", frequency: "once daily", rxnorm_status: "valid", rxnorm_note: "RxNorm matched" }], recommendations: ["Continue current therapy", "Maintain low-sodium diet"], soap: { subjective: "Headaches resolved. Mild residual afternoon fatigue. Adherent to medication.", objective: "Home BP average 132/84. No edema, no new complaints.", assessment: "Hypertension responding well to dual therapy.", plan: "Continue amlodipine 5 mg + lisinopril 10 mg. Repeat labs in 3 months." }, highlights: ["BP controlled on therapy", "No adverse effects reported"], follow_up_points: ["Repeat labs in 3 months"], confidence_flags: [{ field: "diagnosis", level: "high", note: "Consistent with documented BP trend" }] }, validation_flags: [{ medication: "Amlodipine", status: "valid", note: "RxNorm matched" }, { medication: "Lisinopril", status: "valid", note: "RxNorm matched" }], status: "draft_generated", created_at: daysAgo(1), approved_at: null }] });

function loadDB(): DB { if (typeof window === "undefined") return seedDB(); try { const raw = localStorage.getItem(DB_KEY); if (raw) return JSON.parse(raw) as DB; } catch {} const fresh = seedDB(); saveDB(fresh); return fresh; }
function saveDB(db: DB) { if (typeof window === "undefined") return; localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function loadSession(): AuthSession | null { if (typeof window === "undefined") return null; try { const raw = localStorage.getItem(SESSION_KEY); if (!raw) return null; return JSON.parse(raw) as AuthSession; } catch { return null; } }
function saveSession(s: AuthSession | null) { if (typeof window === "undefined") return; if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s)); else localStorage.removeItem(SESSION_KEY); }

function findUser(db: DB, email: string): User | undefined { return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()); }
function findReport(db: DB, id: string): Report | undefined { return db.reports.find((r) => r.id === id); }

/* ------------------------------------------------------------------ */
/* Individual mock functions (exported at top level for type safety)  */
/* ------------------------------------------------------------------ */

export async function mockLogin(p: LoginPayload): Promise<AuthSession> {
  await delay(); const db = loadDB(); const user = findUser(db, p.email);
  if (!user) fail("No account found for this email.");
  const expected = (user as { password?: string }).password ?? "demo1234";
  if (p.password !== expected) fail("Incorrect password.");
  const session: AuthSession = { token: `demo.${user.id}.${Date.now()}`, user };
  saveSession(session); return session;
}

export async function mockRegister(p: RegisterPayload): Promise<User> {
  await delay(); const db = loadDB();
  if (findUser(db, p.email)) fail("An account with this email already exists.");
  const user: User = { id: uid(), name: p.name, email: p.email, role: "pending_doctor", is_approved: false, specialization: p.specialization, created_at: now() };
  db.users.push(user); saveDB(db); return user;
}

export function mockLogout() { saveSession(null); }

export function mockSession(): AuthSession | null { return loadSession(); }

export async function mockPendingDoctors(): Promise<User[]> {
  await delay(300); const db = loadDB(); return db.users.filter((u) => u.role === "pending_doctor").sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function mockApproveDoctor(userId: string): Promise<User> {
  await delay(); const db = loadDB(); const user = db.users.find((u) => u.id === userId);
  if (!user) fail("Doctor not found."); user.role = "doctor"; user.is_approved = true; saveDB(db); return user;
}

export async function mockRejectDoctor(userId: string): Promise<void> { await delay(); const db = loadDB(); db.users = db.users.filter((u) => u.id !== userId); saveDB(db); }

export async function mockCreatePatient(p: CreatePatientPayload): Promise<User> {
  await delay(); const session = loadSession(); if (!session) fail("Not authenticated."); const db = loadDB();
  if (findUser(db, p.email)) fail("A patient with this email already exists.");
  const patient: User & { password?: string } = { id: uid(), name: p.name, email: p.email, role: "patient", is_approved: true, doctor_id: session.user.id, dob: p.dob, created_at: now() };
  patient.password = p.password;
  db.users.push(patient); saveDB(db); return patient;
}

export async function mockMyPatients(): Promise<User[]> { await delay(); const session = loadSession(); if (!session) return []; const db = loadDB(); return db.users.filter((u) => u.role === "patient" && u.doctor_id === session.user.id); }

export async function mockSearchPatients(query: string): Promise<User[]> {
  await delay(); const session = loadSession(); if (!session) return [];
  const q = query.trim().toLowerCase(); if (!q) return [];
  const db = loadDB();
  return db.users.filter((u) => u.role === "patient" && u.doctor_id === session.user.id && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
}

export async function mockMyReports(): Promise<Report[]> { await delay(); const session = loadSession(); if (!session) return []; const db = loadDB(); return db.reports.filter((r) => r.doctor_id === session.user.id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); }

export async function mockGenerateReport(p: GenerateReportPayload): Promise<Report> {
  await delay(2600); const session = loadSession(); if (!session) fail("Not authenticated."); const db = loadDB();
  const report: Report = { id: uid(), patient_id: p.patient_id, doctor_id: session.user.id, audio_name: p.audio?.name ?? `consult_${Date.now()}.m4a`, duration_sec: Math.round((p.audio?.size ?? 1800000) / 48000), transcript_json: seedTranscript, extraction_json: { ...seedExtraction, confidence_flags: [{ field: "symptoms", level: "high", note: "Clear patient-reported timeline" }, { field: "medications", level: "medium", note: "Names extracted; doses recommended by Gemini, flagged for review" }] }, validation_flags: seedExtraction.medications.map((m) => ({ medication: m.name, status: m.rxnorm_status ?? "valid", note: m.rxnorm_note ?? "" })), status: "draft_generated", created_at: now(), approved_at: null };
  db.reports.push(report); saveDB(db); return report;
}

export async function mockGetReport(id: string): Promise<Report> { await delay(); const db = loadDB(); const r = findReport(db, id); if (!r) fail("Report not found."); return r; }
export async function mockUpdateReport(id: string, extraction: Extraction): Promise<Report> { await delay(); const db = loadDB(); const r = findReport(db, id); if (!r) fail("Report not found."); r.extraction_json = extraction; saveDB(db); return r; }
export async function mockApproveReport(id: string): Promise<Report> { await delay(); const db = loadDB(); const r = findReport(db, id); if (!r) fail("Report not found."); r.status = "approved" as ReportStatus; r.approved_at = now(); saveDB(db); return r; }
export async function mockDownloadPdf(_id: string): Promise<Blob> { throw new Error("PDF generation requires the backend."); }

export async function mockPatientReports(): Promise<Report[]> { await delay(); const session = loadSession(); if (!session) return []; const db = loadDB(); return db.reports.filter((r) => r.patient_id === session.user.id && r.status === "approved").sort((a, b) => (a.approved_at && b.approved_at && a.approved_at < b.approved_at ? 1 : -1)); }
export async function mockPatientDoctors(): Promise<User[]> { await delay(200); const session = loadSession(); if (!session) return []; const db = loadDB(); return db.users.filter((u) => u.id === session.user.doctor_id); }

export const demoAccounts = [
  { email: "admin@mediscribe.ai", label: "Admin", role: "admin" },
  { email: "dr.rohan@mediscribe.ai", label: "Doctor", role: "doctor" },
  { email: "ananya@mediscribe.ai", label: "Patient", role: "patient" },
] as const;