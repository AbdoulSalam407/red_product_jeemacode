import React, { useState } from 'react';
import { Navbar, Sidebar, Card, Button } from '../components';
import { Search, Plus, MapPin, DollarSign, Star } from 'lucide-react';

export const Hotels: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const hotels = [
    {
      id: 1,
      name: 'Hôtel Dakar Palace',
      city: 'Dakar',
      price: 150,
      rating: 4.8,
      image: 'https://via.placeholder.com/300x200?text=Dakar+Palace',
    },
    {
      id: 2,
      name: 'Saly Beach Resort',
      city: 'Saly',
      price: 120,
      rating: 4.6,
      image: 'https://via.placeholder.com/300x200?text=Saly+Beach',
    },
    {
      id: 3,
      name: 'Thiès Comfort Inn',
      city: 'Thiès',
      price: 80,
      rating: 4.4,
      image: 'https://via.placeholder.com/300x200?text=Thies+Inn',
    },
    {
      id: 4,
      name: 'Kaolack Luxury Hotel',
      city: 'Kaolack',
      price: 95,
      rating: 4.5,
      image: 'https://via.placeholder.com/300x200?text=Kaolack+Luxury',
    },
  ];

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Hôtels</h1>
              <Button variant="primary" size="lg">
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
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="pt-4">
                    <h3 className="text-lg font-bold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center space-x-1 text-gray-600 mt-2">
                      <MapPin size={16} />
                      <span className="text-sm">{hotel.city}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-1">
                        <DollarSign size={16} className="text-primary" />
                        <span className="font-semibold text-gray-900">
                          {hotel.price}$/nuit
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Voir détails
                    </Button>
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
    </div>
  );
};
