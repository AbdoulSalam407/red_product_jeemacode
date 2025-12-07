import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export interface DashboardStats {
  totalHotels: number;
  totalUsers: number;
  totalReservations: number;
  totalRevenue: number;
  totalTickets: number;
  totalMessages: number;
  totalEmails: number;
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
  // Charger les données en cache au démarrage
  const cachedStats = localStorage.getItem('dashboard_cache');
  const [stats, setStats] = useState<DashboardStats>(
    cachedStats ? JSON.parse(cachedStats) : {
      totalHotels: 0,
      totalUsers: 0,
      totalReservations: 0,
      totalRevenue: 0,
      totalTickets: 0,
      totalMessages: 0,
      totalEmails: 0,
      recentActivities: [],
      popularHotels: [],
    }
  );
  const [isLoading, setIsLoading] = useState(!cachedStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const cacheKey = 'dashboard_cache';
      const cacheTime = localStorage.getItem(cacheKey + '_time');
      const now = Date.now();
      
      // Utiliser le cache si disponible et moins de 5 minutes
      if (cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const response = await api.get('/hotels/dashboard/stats/');
      setStats(response.data);
      setError(null);
      
      // Mettre en cache les données
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(cacheKey + '_time', now.toString());
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
  }, []);

  return { stats, isLoading, error, refetch: fetchStats };
};
