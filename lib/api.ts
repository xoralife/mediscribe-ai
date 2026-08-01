import * as authService from "@/lib/services/auth";
import * as adminService from "@/lib/services/admin";
import * as doctorService from "@/lib/services/doctor";
import * as reportService from "@/lib/services/report";
import * as patientService from "@/lib/services/patient";
import * as healthService from "@/lib/services/health";
import { loadSession, clearSession } from "@/lib/token";
import type {
  AdminAnalytics,
  AdminStats,
  AdminUser,
  AuthSession,
  CreatePatientPayload,
  Extraction,
  GenerateReportPayload,
  HealthStatus,
  IntegrationsStatus,
  LoginPayload,
  RegisterPayload,
  Report,
  User,
} from "@/lib/types";

export const api = {
  login: (p: LoginPayload): Promise<AuthSession> => authService.login(p),
  register: (p: RegisterPayload): Promise<User> => authService.register(p),
  logout(): void { clearSession(); },
  session(): AuthSession | null { return loadSession(); },
  restoreSession(): Promise<AuthSession | null> { return authService.restoreSession(); },
  pendingDoctors: (): Promise<User[]> => adminService.pendingDoctors(),
  approveDoctor: (userId: string): Promise<User> => adminService.promoteDoctor(userId),
  rejectDoctor: (userId: string): Promise<void> => adminService.rejectDoctor(userId),
  adminStats: (): Promise<AdminStats> => adminService.adminStats(),
  adminUsers: (): Promise<AdminUser[]> => adminService.adminUsers(),
  adminIntegrations: (): Promise<IntegrationsStatus> => adminService.adminIntegrations(),
  adminAnalytics: (): Promise<AdminAnalytics> => adminService.adminAnalytics(),
  createPatient: (p: CreatePatientPayload): Promise<User> => doctorService.createPatient(p),
  myPatients: (): Promise<User[]> => doctorService.listPatients(),
  searchPatients: (query: string): Promise<User[]> => doctorService.searchPatients(query),
  myReports: (): Promise<Report[]> => reportService.listDoctorReports(),
  generateReport: (p: GenerateReportPayload): Promise<Report> => reportService.generateReport(p),
  getReport: (id: string): Promise<Report> => reportService.getReport(id),
  updateReport: (id: string, extraction: Extraction): Promise<Report> => reportService.updateReport(id, extraction),
  approveReport: (id: string): Promise<Report> => reportService.approveReport(id),
  downloadReportPdf: (id: string): Promise<Blob> => reportService.downloadReportPdf(id),
  patientReports: (): Promise<Report[]> => patientService.myReports(),
  patientDoctors: (): Promise<User[]> => patientService.patientDoctors(),
  health: (): Promise<HealthStatus> => healthService.getHealth(),
};

export const demoAccounts = [
  { email: "admin@mediscribe.ai", label: "Admin", role: "admin", password: "xora-ai" },
  { email: "dr.rohan@mediscribe.ai", label: "Doctor", role: "doctor", password: "demo1234" },
  { email: "ananya@mediscribe.ai", label: "Patient", role: "patient", password: "demo1234" },
] as const;
