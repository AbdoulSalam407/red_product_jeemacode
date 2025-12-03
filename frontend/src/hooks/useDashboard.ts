import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export interface DashboardStats {
  totalHotels: number;
  totalUsers: number;
  totalReservations: number;
  totalRevenue: number;
  recentActivities: Activity[];
  popularHotels: PopularHotel[];
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface PopularHotel {
  id: number;
  name: string;
  reservations: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHotels: 0,
    totalUsers: 0,
    totalReservations: 0,
    totalRevenue: 0,
    recentActivities: [],
    popularHotels: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/hotels/dashboard/stats/');
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors du chargement des statistiques';
      setError(message);
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Rafraîchir les stats toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
