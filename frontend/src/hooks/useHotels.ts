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

const CACHE_KEY = 'hotels_cache';
const CACHE_TIME_KEY = 'hotels_cache_time';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const useHotels = () => {
  // Charger les données en cache au démarrage
  const cachedHotels = localStorage.getItem(CACHE_KEY);
  const [hotels, setHotels] = useState<Hotel[]>(cachedHotels ? JSON.parse(cachedHotels) : []);
  const [isLoading, setIsLoading] = useState(!cachedHotels);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HotelFilters>({});
  const [syncingHotelIds, setSyncingHotelIds] = useState<Set<number>>(new Set());

  // Invalider le cache
  const invalidateCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  }, []);

  // Vérifier si le cache est valide
  const isCacheValid = useCallback(() => {
    const cacheTime = localStorage.getItem(CACHE_TIME_KEY);
    if (!cacheTime) return false;
    return Date.now() - parseInt(cacheTime) < CACHE_DURATION;
  }, []);

  // Récupérer les hôtels
  const fetchHotels = useCallback(async (skipCache = false) => {
    setError(null);
    
    try {
      // Utiliser le cache si valide et skipCache = false
      if (!skipCache && isCacheValid()) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          setHotels(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
      }

      // Afficher le loader seulement si pas de cache
      setIsLoading(true);

      // Construire les paramètres de la requête
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.city) params.append('city', filters.city);
      if (filters.minPrice) params.append('price_per_night__gte', filters.minPrice.toString());
      if (filters.maxPrice) params.append('price_per_night__lte', filters.maxPrice.toString());
      if (filters.minRating) params.append('rating__gte', filters.minRating.toString());

      // Récupérer les hôtels depuis l'API
      const response = await api.get('/hotels/', { params });
      const hotelsData = response.data.results || response.data;
      
      // Mettre à jour l'état
      setHotels(hotelsData);
      setError(null);
      
      // Mettre en cache les données (sans images pour réduire la taille)
      try {
        const hotelsWithoutImages = hotelsData.map((hotel: any) => ({
          ...hotel,
          image: null
        }));
        localStorage.setItem(CACHE_KEY, JSON.stringify(hotelsWithoutImages));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Impossible de mettre en cache les hôtels');
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Erreur lors du chargement des hôtels';
      setError(message);
      console.error('Erreur fetchHotels:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isCacheValid]);

  useEffect(() => {
    fetchHotels();
  }, [filters]);

  // Créer un hôtel
  const createHotel = useCallback(async (data: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => {
    // ✅ SAUVEGARDER L'ID OPTIMISTE
    const optimisticId = -Math.random();
    
    try {
      const formData = new FormData();
      
      // Ajouter tous les champs au FormData
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof typeof data];
        if (key === 'image' && value instanceof File) {
          formData.append(key, value as File);
        } else if (key !== 'image' && value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

      // Créer un nouvel hôtel optimiste avec un ID temporaire
      const optimisticHotel: Hotel = {
        id: optimisticId, // ✅ Utiliser la variable
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Mettre à jour l'état immédiatement (optimistic update)
      setHotels(prev => [optimisticHotel, ...prev]);
      invalidateCache();

      // Envoyer la requête en arrière-plan
      const response = await api.post('/hotels/', formData);
      
      // Remplacer l'hôtel optimiste par la réponse réelle du serveur
      setHotels(prev => prev.map(h => h.id === optimisticId ? response.data : h));
      
      // ✅ AJOUTER: Recharger les données après succès
      await fetchHotels(true); // skipCache = true
      
      // Afficher l'alerte de succès (sans bloquer avec await)
      Swal.fire({
        icon: 'success',
        title: '✅ Hôtel créé avec succès',
        html: `<div style="text-align: left;">
          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Ville:</strong> ${data.city}</p>
          <p><strong>Prix:</strong> ${data.price_per_night} XOF/nuit</p>
        </div>`,
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    } catch (err: any) {
      // ✅ CORRIGER: Utiliser optimisticId au lieu de err.optimisticId
      setHotels(prev => prev.filter(h => h.id !== optimisticId));
      
      const message = err.response?.data?.detail || err.message || 'Erreur lors de la création';
      const errorDetails = err.response?.data || {};
      setError(message);
      
      Swal.fire({
        icon: 'error',
        title: '❌ Erreur de création',
        html: `<div style="text-align: left;">
          <p><strong>Message:</strong> ${message}</p>
          ${Object.keys(errorDetails).length > 0 ? `<p><strong>Détails:</strong></p><pre style="text-align: left; background: #f3f4f6; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(errorDetails, null, 2)}</pre>` : ''}
        </div>`,
        confirmButtonText: 'Réessayer',
        confirmButtonColor: '#ef4444',
      });
      throw err;
    }
  }, [invalidateCache, fetchHotels]);

  // Mettre à jour un hôtel
  const updateHotel = useCallback(async (id: number, data: Partial<Hotel>) => {
    let previousHotels: Hotel[] = [];
    try {
      // Sauvegarder l'état précédent pour rollback en cas d'erreur
      previousHotels = hotels;
      
      // Marquer l'hôtel comme en cours de synchronisation
      setSyncingHotelIds(prev => new Set([...prev, id]));
      
      // ✅ NE PAS inclure l'image dans l'optimistic update (elle sera reçue du serveur)
      const dataWithoutImage = { ...data };
      delete dataWithoutImage.image;
      
      // Mettre à jour l'état immédiatement (optimistic update)
      setHotels(prev => prev.map(h => 
        h.id === id 
          ? { ...h, ...dataWithoutImage, updated_at: new Date().toISOString() }
          : h
      ));
      invalidateCache();

      const hasImage = data.image instanceof File;
      
      if (hasImage) {
        // Utiliser FormData si c'est un fichier
        const formData = new FormData();
        
        Object.keys(data).forEach((key) => {
          if (key === 'id' || key === 'created_at' || key === 'updated_at') return;
          
          if (key === 'image' && data[key as keyof typeof data] instanceof File) {
            formData.append(key, data[key as keyof typeof data] as File);
          } else if (key !== 'image' && data[key as keyof typeof data] !== null && data[key as keyof typeof data] !== undefined) {
            formData.append(key, String(data[key as keyof typeof data]));
          }
        });

        const response = await api.patch(`/hotels/${id}/`, formData);
        
        // ✅ METTRE À JOUR avec la réponse du serveur (qui inclut l'image)
        setHotels(prev => prev.map(h => h.id === id ? response.data : h));
      } else {
        // Utiliser JSON pour les autres champs
        const payload: any = {};
        Object.keys(data).forEach((key) => {
          if (key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'image' && data[key as keyof typeof data] !== null && data[key as keyof typeof data] !== undefined) {
            payload[key] = data[key as keyof typeof data];
          }
        });
        
        const response = await api.patch(`/hotels/${id}/`, payload);
        
        // ✅ METTRE À JOUR avec la réponse du serveur
        setHotels(prev => prev.map(h => h.id === id ? response.data : h));
      }
      
      Swal.fire({
        icon: 'success',
        title: '✅ Hôtel mis à jour avec succès',
        html: `<div style="text-align: left;">
          <p><strong>ID:</strong> ${id}</p>
          ${data.name ? `<p><strong>Nom:</strong> ${data.name}</p>` : ''}
          ${data.city ? `<p><strong>Ville:</strong> ${data.city}</p>` : ''}
          ${data.price_per_night ? `<p><strong>Prix:</strong> ${data.price_per_night} XOF/nuit</p>` : ''}
          <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">Modifications appliquées avec succès</p>
        </div>`,
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      
      // Retirer l'hôtel de la synchronisation
      setSyncingHotelIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err: any) {
      // Restaurer l'état précédent en cas d'erreur
      setHotels(previousHotels);
      
      // Retirer l'hôtel de la synchronisation
      setSyncingHotelIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      const message = err.response?.data?.detail || err.message || 'Erreur lors de la mise à jour';
      const errorDetails = err.response?.data || {};
      setError(message);
      
      Swal.fire({
        icon: 'error',
        title: '❌ Erreur de mise à jour',
        html: `<div style="text-align: left;">
          <p><strong>Message:</strong> ${message}</p>
          ${Object.keys(errorDetails).length > 0 ? `<p><strong>Détails:</strong></p><pre style="text-align: left; background: #f3f4f6; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(errorDetails, null, 2)}</pre>` : ''}
        </div>`,
        confirmButtonText: 'Réessayer',
        confirmButtonColor: '#ef4444',
      });
      throw err;
    }
  }, [hotels, invalidateCache]);

  // Supprimer un hôtel
  const deleteHotel = useCallback(async (id: number) => {
    let previousHotels: Hotel[] = [];
    try {
      // Confirmation avant suppression
      const result = await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Cette action est irréversible',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
      });

      if (!result.isConfirmed) {
        return;
      }

      // Sauvegarder l'état précédent pour rollback en cas d'erreur
      previousHotels = hotels;
      
      // Marquer l'hôtel comme en cours de synchronisation
      setSyncingHotelIds(prev => new Set([...prev, id]));
      
      // Supprimer l'hôtel immédiatement (optimistic update)
      setHotels(prev => prev.filter(h => h.id !== id));
      invalidateCache();

      // Envoyer la requête en arrière-plan
      await api.delete(`/hotels/${id}/`);
      
      // Récupérer le nom de l'hôtel supprimé
      const deletedHotel = previousHotels.find(h => h.id === id);
      
      Swal.fire({
        icon: 'success',
        title: '✅ Hôtel supprimé avec succès',
        html: `<div style="text-align: left;">
          <p><strong>ID:</strong> ${id}</p>
          ${deletedHotel ? `<p><strong>Nom:</strong> ${deletedHotel.name}</p>` : ''}
          ${deletedHotel ? `<p><strong>Ville:</strong> ${deletedHotel.city}</p>` : ''}
          <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">L'hôtel a été supprimé de la base de données</p>
        </div>`,
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      
      // Retirer l'hôtel de la synchronisation
      setSyncingHotelIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err: any) {
      // Restaurer l'état précédent en cas d'erreur
      setHotels(previousHotels);
      
      // Retirer l'hôtel de la synchronisation
      setSyncingHotelIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      const message = err.response?.data?.detail || err.message || 'Erreur lors de la suppression';
      const errorDetails = err.response?.data || {};
      setError(message);
      
      Swal.fire({
        icon: 'error',
        title: '❌ Erreur de suppression',
        html: `<div style="text-align: left;">
          <p><strong>Message:</strong> ${message}</p>
          ${Object.keys(errorDetails).length > 0 ? `<p><strong>Détails:</strong></p><pre style="text-align: left; background: #f3f4f6; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(errorDetails, null, 2)}</pre>` : ''}
        </div>`,
        confirmButtonText: 'Réessayer',
        confirmButtonColor: '#ef4444',
      });
      throw err;
    }
  }, [hotels, invalidateCache]);

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
    syncingHotelIds,
  };
};
