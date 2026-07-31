import { RequireRole } from "@/components/require-role";
import { ReportsPage } from "@/components/doctor-reports";

export const metadata = { title: "Reports" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <ReportsPage />
    </RequireRole>
  );
}