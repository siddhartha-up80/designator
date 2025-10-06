import { useState, useEffect, useCallback } from "react";

export interface Activity {
  id: string;
  type: "transaction" | "image";
  action: string;
  description: string;
  createdAt: string;
  icon: string;
  credits?: number;
  imageUrl?: string;
}

export function useRecentActivities(limit: number = 5) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/recent-activities?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching recent activities:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const refreshActivities = useCallback(() => {
    return fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refreshActivities,
  };
}
