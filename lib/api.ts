import * as authService from "@/lib/services/auth";
import * as adminService from "@/lib/services/admin";
import * as doctorService from "@/lib/services/doctor";
import * as reportService from "@/lib/services/report";
import * as patientService from "@/lib/services/patient";
import * as healthService from "@/lib/services/health";
import * as publicService from "@/lib/services/public";
import { loadSession, clearSession } from "@/lib/token";
import type {
  AdminAnalytics,
  AdminDoctorCreate,
  AdminStats,
  AdminUser,
  AdminUserUpdate,
  AppointmentHistoryItem,
  AuthSession,
  ContactMessage,
  ContactMessageCreate,
  CreatePatientPayload,
  DoctorProfileUpdate,
  Extraction,
  GenerateReportPayload,
  HealthStatus,
  IntegrationsStatus,
  LoginPayload,
  PublicDoctor,
  RegisterPayload,
  Report,
  User,
} from "@/lib/types";

export const api = {
  login: (p: LoginPayload): Promise<AuthSession> => authService.login(p),
  register: (p: RegisterPayload): Promise<{ user_id: string; role: string }> =>
    authService.register(p),
  requestPermission: (): Promise<User> => authService.requestPermission(),
  uploadAvatar: (file: File): Promise<User> => authService.uploadAvatar(file),
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
  adminCreateDoctor: (p: AdminDoctorCreate): Promise<User> => adminService.createDoctor(p),
  adminUpdateUser: (userId: string, p: AdminUserUpdate): Promise<AdminUser> => adminService.updateUser(userId, p),
  adminDeleteUser: (userId: string): Promise<void> => adminService.deleteUser(userId),
  adminUploadUserAvatar: (userId: string, file: File): Promise<AdminUser> =>
    adminService.uploadUserAvatar(userId, file),
  adminContactMessages: (): Promise<ContactMessage[]> =>
    adminService.adminContactMessages(),
  createPatient: (p: CreatePatientPayload): Promise<User> => doctorService.createPatient(p),
  myPatients: (): Promise<User[]> => doctorService.listPatients(),
  searchPatients: (query: string): Promise<User[]> => doctorService.searchPatients(query),
  myReports: (): Promise<Report[]> => reportService.listDoctorReports(),
  generateReport: (p: GenerateReportPayload): Promise<Report> => reportService.generateReport(p),
  getReport: (id: string): Promise<Report> => reportService.getReport(id),
  updateReport: (id: string, extraction: Extraction): Promise<Report> => reportService.updateReport(id, extraction),
  approveReport: (id: string): Promise<Report> => reportService.approveReport(id),
  downloadReportPdf: (id: string): Promise<Blob> => reportService.downloadReportPdf(id),
  appointmentHistory: (): Promise<AppointmentHistoryItem[]> => patientService.appointmentHistory(),
  patientDoctors: (): Promise<User[]> => patientService.patientDoctors(),
  publicDoctors: (): Promise<PublicDoctor[]> => publicService.publicDoctors(),
  sendContactMessage: (p: ContactMessageCreate): Promise<ContactMessage> =>
    publicService.sendContactMessage(p),
  doctorMessages: (unreadOnly = false): Promise<ContactMessage[]> =>
    doctorService.doctorMessages(unreadOnly),
  markMessageRead: (messageId: string): Promise<ContactMessage> =>
    doctorService.markMessageRead(messageId),
  updateDoctorProfile: (p: DoctorProfileUpdate): Promise<User> =>
    doctorService.updateProfile(p),
  health: (): Promise<HealthStatus> => healthService.getHealth(),
};

export const demoAccounts = [
  { email: "admin@gmail.com", label: "Admin", role: "admin", password: "admin123" },
  { email: "dr.rohan@mediscribe.ai", label: "Doctor", role: "doctor", password: "demo1234" },
  { email: "ananya@mediscribe.ai", label: "Patient", role: "patient", password: "demo1234" },
] as const;
