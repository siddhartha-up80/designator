import { useState, useEffect } from "react";

export interface UserStatistics {
  overview: {
    totalImages: number;
    totalCreditsSpent: number;
    accountAge: string;
    currentCredits: number;
    plan: string;
    recentActivity: number;
  };
  usage: {
    fashionTryons: number;
    promptsCreated: number;
    photosEnhanced: number;
    creditsPurchased: number;
  };
  insights: {
    favoriteFeature: string;
    mostActiveDay: string;
    avgDailyUsage: number;
    efficiencyScore: number;
  };
  imagesByType: Record<string, number>;
  monthlyTrend: Record<string, number>;
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/statistics");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStatistics(data.statistics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/statistics");

      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }

      const data = await response.json();
      setStatistics(data.statistics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  return { statistics, loading, error, refetch };
}
