import { RequireRole } from "@/components/require-role";
import { DoctorProfile } from "@/components/doctor-profile";

export const metadata = { title: "Profile" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <DoctorProfile />
    </RequireRole>
  );
}
