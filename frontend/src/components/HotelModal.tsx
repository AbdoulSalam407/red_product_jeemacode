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
        setImagePreview(initialData.image);
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
    if (selectedImage) {
      data.image = selectedImage;
    }
    await onSubmit(data);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Modifier l\'hôtel' : 'Ajouter un hôtel'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              placeholder="Nom de l'hôtel"
              {...register('name', { required: 'Le nom est requis' })}
              error={errors.name}
            />
            <Input
              label="Ville"
              placeholder="Ville"
              {...register('city', { required: 'La ville est requise' })}
              error={errors.city}
            />
          </div>

          <Input
            label="Description"
            placeholder="Description de l'hôtel"
            {...register('description')}
            error={errors.description}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de l'hôtel
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
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
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded mb-2" />
                    <p className="text-sm text-primary">Cliquer pour changer l'image</p>
                  </div>
                ) : initialData?.image ? (
                  <div>
                    <img src={initialData.image as string} alt="Current" className="w-full h-40 object-cover rounded mb-2" />
                    <p className="text-sm text-primary">Cliquer pour changer l'image</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Cliquer pour ajouter une image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Input
            label="Adresse"
            placeholder="Adresse complète"
            {...register('address', { required: 'L\'adresse est requise' })}
            error={errors.address}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              placeholder="+221 33 XXX XX XX"
              {...register('phone')}
              error={errors.phone}
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@hotel.com"
              {...register('email', { required: 'L\'email est requis' })}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prix par nuit (XOF)"
              type="number"
              placeholder="15000"
              step="100"
              {...register('price_per_night', { 
                required: 'Le prix est requis',
                min: 0,
              })}
              error={errors.price_per_night}
            />
            <Input
              label="Note (0-5)"
              type="number"
              placeholder="4.5"
              step="0.1"
              min="0"
              max="5"
              {...register('rating', { 
                required: 'La note est requise',
                min: 0,
                max: 5,
              })}
              error={errors.rating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre total de chambres"
              type="number"
              placeholder="120"
              {...register('rooms_count', { 
                required: 'Le nombre de chambres est requis',
                min: 1,
              })}
              error={errors.rooms_count}
            />
            <Input
              label="Chambres disponibles"
              type="number"
              placeholder="45"
              {...register('available_rooms', { 
                required: 'Le nombre de chambres disponibles est requis',
                min: 0,
              })}
              error={errors.available_rooms}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Hôtel actif
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
            >
              {initialData ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
