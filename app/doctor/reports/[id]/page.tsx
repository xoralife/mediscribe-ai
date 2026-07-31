import { RequireRole } from "@/components/require-role";
import { ReportDetail } from "@/components/doctor-report-detail";

export const metadata = { title: "Report review" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <ReportDetail />
    </RequireRole>
  );
}