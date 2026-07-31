import { RequireRole } from "@/components/require-role";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata = { title: "Admin console" };

export default function Page() {
  return (
    <RequireRole role="admin">
      <AdminDashboard />
    </RequireRole>
  );
}