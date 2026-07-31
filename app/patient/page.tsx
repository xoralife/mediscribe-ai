import { RequireRole } from "@/components/require-role";
import { PatientDashboard } from "@/components/patient-dashboard";

export const metadata = { title: "My reports" };

export default function Page() {
  return (
    <RequireRole role="patient">
      <PatientDashboard />
    </RequireRole>
  );
}
