import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import Swal from 'sweetalert2';

export interface Hotel {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  price_per_night: number;
  rating: number;
  image?: string | File;
  rooms_count: number;
  available_rooms: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HotelFilters {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export const useHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HotelFilters>({});

  // Récupérer les hôtels
  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('price_per_night__gte', filters.minPrice.toString());
      if (filters.maxPrice) params.append('price_per_night__lte', filters.maxPrice.toString());
      if (filters.minRating) params.append('rating__gte', filters.minRating.toString());

      const response = await api.get('/hotels/', { params });
      setHotels(response.data.results || response.data);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors du chargement des hôtels';
      setError(message);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Créer un hôtel
  const createHotel = useCallback(async (data: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const payload = { ...data };
      
      // Convertir File en base64 si nécessaire
      if (payload.image instanceof File) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            payload.image = reader.result as string;
            resolve(null);
          };
          reader.onerror = reject;
          reader.readAsDataURL(payload.image as File);
        });
      }

      const response = await api.post('/hotels/', payload);
      setHotels([...hotels, response.data]);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Hôtel créé avec succès',
        timer: 1500,
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors de la création';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
      });
      throw err;
    }
  }, [hotels]);

  // Mettre à jour un hôtel
  const updateHotel = useCallback(async (id: number, data: Partial<Hotel>) => {
    try {
      const payload = { ...data };
      
      // Convertir File en base64 si nécessaire
      if (payload.image instanceof File) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            payload.image = reader.result as string;
            resolve(null);
          };
          reader.onerror = reject;
          reader.readAsDataURL(payload.image as File);
        });
      }

      const response = await api.put(`/hotels/${id}/`, payload);
      setHotels(hotels.map(h => h.id === id ? response.data : h));
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Hôtel mis à jour avec succès',
        timer: 1500,
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors de la mise à jour';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
      });
      throw err;
    }
  }, [hotels]);

  // Supprimer un hôtel
  const deleteHotel = useCallback(async (id: number) => {
    try {
      await api.delete(`/hotels/${id}/`);
      setHotels(hotels.filter(h => h.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Hôtel supprimé avec succès',
        timer: 1500,
      });
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors de la suppression';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: message,
      });
      throw err;
    }
  }, [hotels]);

  return {
    hotels,
    isLoading,
    error,
    filters,
    setFilters,
    fetchHotels,
    createHotel,
    updateHotel,
    deleteHotel,
  };
};
