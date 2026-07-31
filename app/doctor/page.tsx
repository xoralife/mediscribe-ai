import { RequireRole } from "@/components/require-role";
import { DoctorOverview } from "@/components/doctor-overview";

export const metadata = { title: "Doctor overview" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <DoctorOverview />
    </RequireRole>
  );
}