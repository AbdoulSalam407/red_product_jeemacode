# 🖼️ Frontend - Images en Base64

## 📋 Vue d'ensemble

Intégration complète du système d'images base64 dans le frontend React.

---

## 🔧 Hook React pour les Images

### `useImages.ts`

```typescript
import { useState, useCallback } from 'react';
import api from '../lib/api';

export interface ImageData {
  id: number;
  title: string;
  description: string;
  image_base64: string;
  image_type: string;
  image_size_mb: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useImages = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer toutes les images
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/images/');
      setImages(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des images');
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une image
  const createImage = useCallback(async (
    title: string,
    description: string,
    imageBase64: string
  ) => {
    setLoading(true);
    try {
      const response = await api.post('/images/', {
        title,
        description,
        image_base64: imageBase64
      });
      setImages(prev => [response.data, ...prev]);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la création');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une image
  const updateImage = useCallback(async (
    id: number,
    data: Partial<ImageData>
  ) => {
    setLoading(true);
    try {
      const response = await api.patch(`/images/${id}/`, data);
      setImages(prev => prev.map(img => img.id === id ? response.data : img));
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une image
  const deleteImage = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`/images/${id}/`);
      setImages(prev => prev.filter(img => img.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convertir un fichier en base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  return {
    images,
    loading,
    error,
    fetchImages,
    createImage,
    updateImage,
    deleteImage,
    fileToBase64
  };
};
```

---

## 🎨 Composant d'Upload d'Image

### `ImageUpload.tsx`

```typescript
import React, { useRef, useState } from 'react';
import { useImages } from '../hooks/useImages';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageCreated?: (image: any) => void;
  maxSize?: number; // en MB
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageCreated,
  maxSize = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { createImage, fileToBase64 } = useImages();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      alert(`L'image ne doit pas dépasser ${maxSize} MB`);
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Le fichier doit être une image');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
    } catch (err) {
      alert('Erreur lors de la lecture du fichier');
    }
  };

  const handleUpload = async () => {
    if (!preview || !title) {
      alert('Veuillez remplir le titre et sélectionner une image');
      return;
    }

    setUploading(true);
    try {
      const image = await createImage(title, description, preview);
      setTitle('');
      setDescription('');
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onImageCreated?.(image);
      alert('Image créée avec succès');
    } catch (err) {
      alert('Erreur lors de la création de l\'image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Ajouter une Image</h2>

      {/* Préview */}
      {preview && (
        <div className="mb-4 relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Formulaire */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de l'image"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="border-2 border-dashed rounded p-6 text-center cursor-pointer hover:bg-gray-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center"
            >
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-600">Cliquez pour sélectionner une image</p>
              <p className="text-sm text-gray-400">Max {maxSize} MB</p>
            </button>
          </div>
        </div>

        {/* Bouton Upload */}
        <button
          onClick={handleUpload}
          disabled={!preview || !title || uploading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? 'Envoi en cours...' : 'Créer l\'image'}
        </button>
      </div>
    </div>
  );
};
```

---

## 🖼️ Composant d'Affichage des Images

### `ImageGallery.tsx`

```typescript
import React, { useEffect } from 'react';
import { useImages } from '../hooks/useImages';
import { Trash2, Edit2 } from 'lucide-react';

interface ImageGalleryProps {
  onEdit?: (image: any) => void;
  onDelete?: (id: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  onEdit,
  onDelete
}) => {
  const { images, loading, fetchImages, deleteImage } = useImages();

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      try {
        await deleteImage(id);
        onDelete?.(id);
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (images.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune image</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
          {/* Image */}
          <img
            src={image.image_base64}
            alt={image.title}
            className="w-full h-48 object-cover"
          />

          {/* Contenu */}
          <div className="p-4">
            <h3 className="font-bold text-lg">{image.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{image.description}</p>
            <p className="text-xs text-gray-500 mb-3">
              {image.image_type.toUpperCase()} • {image.image_size_mb} MB
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(image)}
                className="flex-1 bg-blue-500 text-white py-1 rounded flex items-center justify-center gap-1 hover:bg-blue-600"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="flex-1 bg-red-500 text-white py-1 rounded flex items-center justify-center gap-1 hover:bg-red-600"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## 📝 Composant d'Édition

### `ImageEditor.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { useImages } from '../hooks/useImages';

interface ImageEditorProps {
  imageId: number;
  onSave?: () => void;
  onCancel?: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageId,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { images, updateImage } = useImages();

  useEffect(() => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      setTitle(image.title);
      setDescription(image.description || '');
    }
  }, [imageId, images]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateImage(imageId, { title, description });
      onSave?.();
      alert('Image mise à jour avec succès');
    } catch (err) {
      alert('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Modifier l'Image</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## 🎯 Page Complète

### `ImagesPage.tsx`

```typescript
import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { ImageGallery } from '../components/ImageGallery';
import { ImageEditor } from '../components/ImageEditor';

export const ImagesPage: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Gestion des Images</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload */}
        <div className="lg:col-span-1">
          <ImageUpload onImageCreated={() => {}} />
        </div>

        {/* Galerie ou Édition */}
        <div className="lg:col-span-2">
          {editingId ? (
            <ImageEditor
              imageId={editingId}
              onSave={() => setEditingId(null)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <ImageGallery
              onEdit={(image) => setEditingId(image.id)}
              onDelete={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 🔌 Intégration avec les Hôtels

### Ajouter une image à un hôtel

```typescript
const addImageToHotel = async (hotelId: number, imageId: number) => {
  const response = await api.post('/hotel-images/', {
    hotel: hotelId,
    image: imageId,
    order: 0,
    is_primary: true
  });
  return response.data;
};
```

### Récupérer les images d'un hôtel

```typescript
const getHotelImages = async (hotelId: number) => {
  const response = await api.get(`/hotel-images/by_hotel/?hotel_id=${hotelId}`);
  return response.data;
};
```

---

## ✅ Checklist d'Intégration

- [ ] Créer le hook `useImages.ts`
- [ ] Créer le composant `ImageUpload.tsx`
- [ ] Créer le composant `ImageGallery.tsx`
- [ ] Créer le composant `ImageEditor.tsx`
- [ ] Créer la page `ImagesPage.tsx`
- [ ] Ajouter la route dans le routeur
- [ ] Tester la création d'image
- [ ] Tester la lecture d'image
- [ ] Tester la mise à jour d'image
- [ ] Tester la suppression d'image
- [ ] Tester l'intégration avec les hôtels

---

**Date:** 8 Décembre 2024
**Version:** 1.0.0
**Status:** ✅ Prêt pour intégration
