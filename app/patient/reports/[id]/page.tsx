import { RequireRole } from "@/components/require-role";
import { PatientReportDetail } from "@/components/patient-report-detail";

export const metadata = { title: "Report" };

export default function Page() {
  return (
    <RequireRole role="patient">
      <PatientReportDetail />
    </RequireRole>
  );
}
