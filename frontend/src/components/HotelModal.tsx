import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { Input, Button } from './index';
import { Hotel } from '../hooks/useHotels';

interface HotelFormData {
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  price_per_night: number;
  rating: number;
  rooms_count: number;
  available_rooms: number;
  is_active: boolean;
}

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Hotel, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Hotel;
  isLoading?: boolean;
}

export const HotelModal: React.FC<HotelModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<HotelFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      price_per_night: 0,
      rating: 0,
      rooms_count: 0,
      available_rooms: 0,
      is_active: true,
    },
  });

  // Mettre à jour les champs quand initialData change
  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description);
      setValue('city', initialData.city);
      setValue('address', initialData.address);
      setValue('phone', initialData.phone);
      setValue('email', initialData.email);
      setValue('price_per_night', initialData.price_per_night);
      setValue('rating', initialData.rating);
      setValue('rooms_count', initialData.rooms_count);
      setValue('available_rooms', initialData.available_rooms);
      setValue('is_active', initialData.is_active);
      
      // Afficher l'image existante
      if (initialData.image && typeof initialData.image === 'string') {
        // Construire l'URL correcte pour l'image
        const imageUrl = initialData.image.startsWith('data:') || initialData.image.startsWith('http') || initialData.image.startsWith('/')
          ? initialData.image
          : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/media/${initialData.image}`;
        setImagePreview(imageUrl);
      }
    } else {
      reset();
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [initialData, setValue, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setSelectedImage(null);
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    // Convertir les nombres
    const convertedData = {
      ...data,
      price_per_night: data.price_per_night ? parseFloat(data.price_per_night) : data.price_per_night,
      rating: data.rating ? parseFloat(data.rating) : data.rating,
      rooms_count: data.rooms_count ? parseInt(data.rooms_count) : data.rooms_count,
      available_rooms: data.available_rooms ? parseInt(data.available_rooms) : data.available_rooms,
    };
    
    console.log('Form data before submit:', convertedData);
    
    // En mode édition, envoyer seulement les champs modifiés
    if (initialData) {
      const modifiedData: any = {};
      
      // Comparer avec les données initiales et envoyer seulement les champs modifiés
      Object.keys(convertedData).forEach((key) => {
        const initialValue = initialData[key as keyof typeof initialData];
        const currentValue = convertedData[key];
        
        // Comparer les valeurs (en convertissant en string pour éviter les problèmes de type)
        if (String(initialValue) !== String(currentValue)) {
          modifiedData[key] = currentValue;
        }
      });
      
      // Toujours inclure l'image si elle est sélectionnée (uniquement si c'est un File)
      if (selectedImage instanceof File) {
        modifiedData.image = selectedImage;
      }
      
      console.log('Modified data:', modifiedData);
      await onSubmit(modifiedData);
    } else {
      // En mode création, envoyer tous les champs
      if (selectedImage instanceof File) {
        convertedData.image = selectedImage;
      }
      console.log('Create data:', convertedData);
      await onSubmit(convertedData);
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-1">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-2 max-h-[96vh] flex flex-col">
        <div className="flex justify-between items-center px-3 py-2 border-b bg-white flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? 'Modifier' : 'Ajouter'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-1">
            <Input
              label="Nom"
              placeholder="Nom"
              {...register('name', { required: initialData ? false : 'Le nom est requis' })}
              error={errors.name}
            />
            <Input
              label="Ville"
              placeholder="Ville"
              {...register('city', { required: initialData ? false : 'La ville est requise' })}
              error={errors.city}
            />
          </div>

          <textarea
            placeholder="Description"
            {...register('description')}
            rows={1}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
          />

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">
              Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded p-1 text-center hover:border-primary transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="hotel-image"
              />
              <label htmlFor="hotel-image" className="cursor-pointer">
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" className="w-full h-12 object-cover rounded mb-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <p className="text-xs text-primary">Changer</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={14} className="mx-auto text-gray-400 mb-0.5" />
                    <p className="text-xs text-gray-600">Ajouter</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Input
            label="Adresse"
            placeholder="Adresse"
            {...register('address', { required: initialData ? false : 'L\'adresse est requise' })}
            error={errors.address}
          />

          <div className="grid grid-cols-2 gap-1">
            <Input
              label="Tél"
              placeholder="+221 33 XXX XX XX"
              {...register('phone')}
              error={errors.phone}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@hotel.com"
              {...register('email', { required: initialData ? false : 'L\'email est requis' })}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Input
              label="Prix"
              type="number"
              placeholder="15000"
              step="100"
              {...register('price_per_night', { 
                required: initialData ? false : 'Le prix est requis',
                min: 0,
              })}
              error={errors.price_per_night}
            />
            <Input
              label="Note"
              type="number"
              placeholder="4.5"
              step="0.1"
              min="0"
              max="5"
              {...register('rating', { 
                required: initialData ? false : 'La note est requise',
                min: 0,
                max: 5,
              })}
              error={errors.rating}
            />
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Input
              label="Chambres"
              type="number"
              placeholder="120"
              {...register('rooms_count', { 
                required: initialData ? false : 'Le nombre de chambres est requis',
                min: 1,
              })}
              error={errors.rooms_count}
            />
            <Input
              label="Dispo"
              type="number"
              placeholder="45"
              {...register('available_rooms', { 
                required: initialData ? false : 'Le nombre de chambres disponibles est requis',
                min: 0,
              })}
              error={errors.available_rooms}
            />
          </div>

          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-3 h-3 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-gray-700">
              Actif
            </label>
          </div>

          <div className="flex justify-end space-x-1 pt-1 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="text-xs px-2 py-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              className="text-xs px-2 py-1"
            >
              {initialData ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
