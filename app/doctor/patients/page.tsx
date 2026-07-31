import { RequireRole } from "@/components/require-role";
import { PatientsPage } from "@/components/doctor-patients";

export const metadata = { title: "Patients" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <PatientsPage />
    </RequireRole>
  );
}