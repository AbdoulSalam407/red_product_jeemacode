import React from 'react';
import { Trash2 } from 'lucide-react';
import { clearCache, getCacheInfo } from '../utils/clearCache';
import Swal from 'sweetalert2';

export const ClearCacheButton: React.FC = () => {
  const handleClearCache = async () => {
    const result = await Swal.fire({
      title: 'Vider le cache?',
      text: 'Cela rechargera les données depuis le serveur',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Vider',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      const success = clearCache();
      
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Cache vidé',
          text: 'Le cache a été vidé avec succès. Rechargez la page.',
          confirmButtonText: 'Recharger',
          confirmButtonColor: '#10b981',
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de vider le cache',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const handleViewCacheInfo = () => {
    const info = getCacheInfo();
    
    if (info) {
      Swal.fire({
        title: 'Informations du cache',
        html: `
          <div style="text-align: left;">
            <p><strong>Cache présent:</strong> ${info.hasCacheData ? 'Oui' : 'Non'}</p>
            <p><strong>Taille:</strong> ${(info.cacheSize / 1024).toFixed(2)} KB</p>
            <p><strong>Dernière mise à jour:</strong> ${info.cacheTime || 'Jamais'}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleViewCacheInfo}
        title="Voir les informations du cache"
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
      >
        <Trash2 size={18} />
      </button>
      <button
        onClick={handleClearCache}
        title="Vider le cache"
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1"
      >
        <Trash2 size={16} />
        Vider cache
      </button>
    </div>
  );
};
