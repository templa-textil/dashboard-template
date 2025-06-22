import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Bienvenido, {session?.user.name}
        </h2>
        <p className="text-muted-foreground">
          Aquí puedes ver tus estadísticas y realizar acciones rápidas
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
