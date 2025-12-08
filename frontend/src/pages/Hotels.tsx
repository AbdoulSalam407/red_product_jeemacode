import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Navbar, Sidebar, Card, Button, HotelModal } from '../components';
import { Search, Plus, MapPin, DollarSign, Star, Edit, Trash2 } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';

export const Hotels: React.FC = () => {
  const { hotels, isLoading, createHotel, updateHotel, deleteHotel, syncingHotelIds } = useHotels();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Afficher/masquer l'alerte de chargement
  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: 'Chargement des hôtels',
        html: 'Veuillez patienter...',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      Swal.close();
    }
  }, [isLoading]);

  // Filtrer les hôtels localement aussi
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHotel = () => {
    setSelectedHotel(null);
    setIsModalOpen(true);
  };

  const handleEditHotel = (hotel: any) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleDeleteHotel = async (id: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action ne peut pas être annulée',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      await deleteHotel(id);
    }
  };

  const handleSubmitHotel = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedHotel) {
        await updateHotel(selectedHotel.id, data);
      } else {
        await createHotel(data);
      }
      // Fermer le modal immédiatement (l'alerte s'affiche en arrière-plan)
      setIsModalOpen(false);
    } catch (error) {
      // L'erreur est déjà gérée dans useHotels avec SweetAlert
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hôtels</h1>
              <Button variant="primary" size="lg" onClick={handleAddHotel} className="w-full sm:w-auto">
                <Plus size={20} className="mr-2" />
                Ajouter un hôtel
              </Button>
            </div>

            <Card className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-2">
                <Search size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher un hôtel ou une ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none bg-transparent min-w-0"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredHotels.map((hotel) => {
                const isSyncing = syncingHotelIds.has(hotel.id);
                return (
                <Card key={hotel.id} className={`overflow-hidden hover:shadow-lg transition flex flex-col relative ${isSyncing ? 'opacity-60 pointer-events-none' : ''}`}>
                  {isSyncing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 z-10">
                      <div className="animate-spin">
                        <div className="w-8 h-8 border-4 border-white border-t-primary rounded-full"></div>
                      </div>
                    </div>
                  )}
                  <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden relative">
                    {hotel.image ? (
                      <>
                        <img 
                          src={
                            typeof hotel.image === 'string'
                              ? hotel.image.startsWith('data:') || hotel.image.startsWith('http') || hotel.image.startsWith('/')
                                ? hotel.image 
                                : `${import.meta.env.VITE_API_URL?.replace('/api', '')}/media/${hotel.image}`
                              : ''
                          }
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Si l'image ne charge pas, afficher la première lettre
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="absolute text-white text-4xl font-bold hidden">{hotel.name.charAt(0)}</span>
                      </>
                    ) : (
                      <span className="text-white text-4xl font-bold">{hotel.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex-1">{hotel.description}</p>
                    <div className="flex items-center space-x-1 text-gray-600 mt-2">
                      <MapPin size={16} />
                      <span className="text-sm">{hotel.city}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-1">
                        <DollarSign size={16} className="text-primary" />
                        <span className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(hotel.price_per_night)}/nuit
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditHotel(hotel)}
                      >
                        <Edit size={16} className="mr-1" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteHotel(hotel.id)}
                      >
                        <Trash2 size={16} className="mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>

            {filteredHotels.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-gray-600 text-lg">Aucun hôtel trouvé</p>
              </Card>
            )}
          </div>
        </main>
      </div>

      <HotelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitHotel}
        initialData={selectedHotel}
        isLoading={isSubmitting}
      />
    </div>
  );
};
