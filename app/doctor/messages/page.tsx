import { RequireRole } from "@/components/require-role";
import { DoctorMessages } from "@/components/doctor-messages";

export const metadata = { title: "Messages" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <DoctorMessages />
    </RequireRole>
  );
}
