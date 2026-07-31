import { isNetworkError } from "@/lib/http";
import * as healthService from "@/lib/services/health";
import * as mock from "@/lib/mock";
import * as authService from "@/lib/services/auth";
import * as adminService from "@/lib/services/admin";
import * as doctorService from "@/lib/services/doctor";
import * as reportService from "@/lib/services/report";
import * as patientService from "@/lib/services/patient";
import type {
  AuthSession,
  CreatePatientPayload,
  Extraction,
  GenerateReportPayload,
  LoginPayload,
  RegisterPayload,
  Report,
  User,
} from "@/lib/types";

async function withFallback<T>(realCall: () => Promise<T>, mockCall: () => Promise<T>): Promise<T> {
  try { return await realCall(); } catch (e) { if (isNetworkError(e)) return await mockCall(); throw e; }
}

export const api = {
  async login(p: LoginPayload): Promise<AuthSession> { return withFallback(() => authService.login(p), () => mock.mockLogin(p)); },
  async register(p: RegisterPayload): Promise<User> { return withFallback(() => authService.register(p), () => mock.mockRegister(p)); },
  logout() { mock.mockLogout(); },
  session(): AuthSession | null { return mock.mockSession(); },
  async restoreSession(): Promise<AuthSession | null> {
    const stored = mock.mockSession(); if (!stored) return null;
    try { return await authService.restoreSession(); } catch (e) { if (isNetworkError(e)) return stored; throw e; }
  },
  async pendingDoctors(): Promise<User[]> { return withFallback(() => adminService.pendingDoctors(), () => mock.mockPendingDoctors()); },
  async approveDoctor(userId: string): Promise<User> { return withFallback(() => adminService.promoteDoctor(userId), () => mock.mockApproveDoctor(userId)); },
  async rejectDoctor(userId: string): Promise<void> { await mock.mockRejectDoctor(userId); },
  async createPatient(p: CreatePatientPayload): Promise<User> { return withFallback(() => doctorService.createPatient(p), () => mock.mockCreatePatient(p)); },
  async myPatients(): Promise<User[]> { return withFallback(() => doctorService.listPatients(), () => mock.mockMyPatients()); },
  async searchPatients(query: string): Promise<User[]> { return withFallback(() => doctorService.searchPatients(query), () => mock.mockSearchPatients(query)); },
  async myReports(): Promise<Report[]> { return withFallback(() => patientService.myReports(), () => mock.mockMyReports()); },
  async generateReport(p: GenerateReportPayload): Promise<Report> { return withFallback(() => reportService.generateReport(p), () => mock.mockGenerateReport(p)); },
  async getReport(id: string): Promise<Report> { return withFallback(() => reportService.getReport(id), () => mock.mockGetReport(id)); },
  async updateReport(id: string, extraction: Extraction): Promise<Report> { return withFallback(() => reportService.updateReport(id, extraction), () => mock.mockUpdateReport(id, extraction)); },
  async approveReport(id: string): Promise<Report> { return withFallback(() => reportService.approveReport(id), () => mock.mockApproveReport(id)); },
  async downloadReportPdf(id: string): Promise<Blob> { return withFallback(() => reportService.downloadReportPdf(id), () => mock.mockDownloadPdf(id)); },
  async patientReports(): Promise<Report[]> { return withFallback(() => patientService.myReports(), () => mock.mockPatientReports()); },
  async patientDoctors(): Promise<User[]> { return withFallback(() => patientService.patientDoctors(), () => mock.mockPatientDoctors()); },
  async health() { return withFallback(() => healthService.getHealth(), async () => ({ status: "ok", message: "Offline — demo mode" })); },
};

export const demoAccounts = mock.demoAccounts;