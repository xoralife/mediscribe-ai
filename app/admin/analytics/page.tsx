import type { Metadata } from "next";
import { RequireRole } from "@/components/require-role";
import { AdminAnalytics } from "@/components/admin-analytics";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <RequireRole role="admin">
      <AdminAnalytics />
    </RequireRole>
  );
}
