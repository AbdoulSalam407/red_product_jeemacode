import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Navbar, Sidebar, Card, Button, HotelModal } from '../components';
import { Search, Plus, MapPin, DollarSign, Star, Edit, Trash2 } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';

export const Hotels: React.FC = () => {
  const { hotels, isLoading, filters, setFilters, createHotel, updateHotel, deleteHotel } = useHotels();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mettre à jour les filtres
  const handleFilterChange = () => {
    setFilters({
      search: searchTerm,
      city: selectedCity,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hôtels</h1>
              <Button variant="primary" size="lg" onClick={handleAddHotel}>
                <Plus size={20} className="mr-2" />
                Ajouter un hôtel
              </Button>
            </div>

            <Card className="mb-8">
              <div className="flex items-center space-x-2">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un hôtel ou une ville..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition flex flex-col">
                  <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden">
                    {hotel.image ? (
                      <img 
                        src={hotel.image as string} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
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
              ))}
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
