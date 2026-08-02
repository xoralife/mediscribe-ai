export type Role = "admin" | "pending_doctor" | "doctor" | "patient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_approved: boolean;
  specialization?: string | null;
  doctor_id?: string | null;
  dob?: string | null;
  avatar_url?: string | null;
  permission_requested?: boolean;
  permission_requested_at?: string | null;
  created_at: string;
}

export interface PublicDoctor {
  id: string;
  name: string;
  email: string;
  specialization?: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface ContactMessageCreate {
  doctor_id: string;
  name: string;
  email: string;
  phone: string;
  age?: string | null;
  message: string;
}

export interface ContactMessage {
  id: string;
  doctor_id: string;
  name: string;
  email: string;
  phone: string;
  age?: number | null;
  message: string;
  read: boolean;
  created_at: string;
}

export interface DoctorProfileUpdate {
  name?: string;
  specialization?: string;
}

export type ReportStatus = "draft_generated" | "approved";

export interface TranscriptSegment {
  speaker: string;
  time: number;
  end?: number;
  text: string;
  text_en?: string | null;
  text_ur?: string | null;
}

export interface TranscriptData {
  text?: string;
  segments: Array<{ speaker: string | null; start: number | null; end: number | null; text: string; text_en?: string | null; text_ur?: string | null }>;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  rxnorm_status?: "valid" | "unrecognized" | "warning";
  rxnorm_note?: string;
}

export interface ConfidenceFlag {
  field: string;
  level: "high" | "medium" | "low";
  note: string;
}

export interface Extraction {
  symptoms: string[];
  medical_history: string[];
  diagnosis: string[];
  medications: Medication[];
  recommendations: string[];
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  highlights: string[];
  follow_up_points: string[];
  confidence_flags: ConfidenceFlag[];
}

export interface Report {
  id: string;
  patient_id: string;
  doctor_id: string;
  audio_url?: string | null;
  audio_name?: string | null;
  duration_sec?: number;
  patient_name?: string | null;
  patient_email?: string | null;
  transcript_json?: TranscriptSegment[] | TranscriptData | null;
  extraction_json: Extraction;
  validation_flags: Record<string, string>[];
  status: ReportStatus;
  created_at: string;
  approved_at?: string | null;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  specialization: string;
}
export interface AdminDoctorCreate {
  name: string;
  email: string;
  password: string;
  specialization?: string;
}

export interface AdminUserUpdate {
  name?: string;
  email?: string;
  specialization?: string | null;
  password?: string;
}

export interface CreatePatientPayload {
  name: string;
  email: string;
  dob: string;
  password: string;
}

export interface GenerateReportPayload {
  patient_id: string;
  audio?: File | null;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
  user_id?: string;
  role?: string;
  is_approved?: boolean;
}

export interface HealthStatus {
  status: string;
  message?: string;
  version?: string;
  database?: string;
}

export interface AdminStats {
  total_users: number;
  doctors: number;
  pending_doctors: number;
  patients: number;
  reports: number;
  approved_reports: number;
  draft_reports: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  is_approved: boolean;
  specialization?: string | null;
  doctor_id?: string | null;
  doctor_name?: string | null;
  report_count?: number;
  dob?: string | null;
  created_at: string;
}

export type IntegrationStatus = "ok" | "error" | "unconfigured";

export interface Integration {
  configured: boolean;
  status: IntegrationStatus;
  detail?: string | null;
}

export interface IntegrationsStatus {
  database: Integration;
  mistral: Integration;
  gemini: Integration;
  supabase: Integration;
  rxnorm: Integration;
  checked_at: string;
}

export interface DailyReportPoint {
  date: string;
  generated: number;
  approved: number;
}

export interface DailyUserPoint {
  date: string;
  new_users: number;
  doctors: number;
  patients: number;
}

export interface DoctorReportBreakdown {
  doctor_name: string;
  total: number;
  approved: number;
}

export interface AdminAnalytics {
  reports_over_time: DailyReportPoint[];
  users_over_time: DailyUserPoint[];
  reports_by_doctor: DoctorReportBreakdown[];
  totals: AdminStats;
  approval_rate: number;
}

export interface ReportMeta {
  doctor?: Pick<User, "id" | "name" | "specialization"> | null;
  patient?: Pick<User, "id" | "name" | "email" | "dob"> | null;
}
