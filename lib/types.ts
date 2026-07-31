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
  created_at: string;
}

export type ReportStatus = "draft_generated" | "approved";

export interface TranscriptSegment {
  speaker: string;
  time: number;
  text: string;
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
  transcript_json: TranscriptSegment[];
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

export interface CreatePatientPayload {
  name: string;
  email: string;
  dob: string;
}

export interface GenerateReportPayload {
  patient_id: string;
  audio?: File | null;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
}

export interface HealthStatus {
  status: string;
  message?: string;
  version?: string;
  database?: string;
}

export interface ReportMeta {
  doctor?: Pick<User, "id" | "name" | "specialization"> | null;
  patient?: Pick<User, "id" | "name" | "email" | "dob"> | null;
}
