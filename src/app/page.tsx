import { Dashboard } from "@/components/dashboard/dashboard";
import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

// Desabilitar static generation
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
