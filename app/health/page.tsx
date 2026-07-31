import { AppShell } from "@/components/app-shell";
import { HealthStatus, AdminHealthDashboard } from "@/components/health-status";
import { PageHeader } from "@/components/ui";

export const metadata = { title: "Health" };

export default function Page() {
  return (
    <AppShell nav={[]} roleLabel="System">
      <AdminHealthDashboard />
    </AppShell>
  );
}