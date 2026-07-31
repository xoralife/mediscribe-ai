import { RequireRole } from "@/components/require-role";
import { GeneratePage } from "@/components/doctor-generate";

export const metadata = { title: "Generate report" };

export default function Page() {
  return (
    <RequireRole role="doctor">
      <GeneratePage />
    </RequireRole>
  );
}