"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardStats, RecentActivity } from "@/types/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async (): Promise<RecentActivity[]> => {
      const response = await fetch("/api/dashboard/activity");
      if (!response.ok) throw new Error("Failed to fetch recent activity");
      return response.json();
    },
  });
}
