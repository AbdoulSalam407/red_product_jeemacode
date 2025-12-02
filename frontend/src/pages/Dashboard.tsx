import React from 'react';
import { Navbar, Sidebar, Card } from '../components';
import { BarChart3, Users, Hotel, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Hôtels', value: '8', icon: Hotel, color: 'bg-blue-500' },
    { label: 'Utilisateurs', value: '24', icon: Users, color: 'bg-green-500' },
    { label: 'Réservations', value: '156', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Revenus', value: '45.2K', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="text-white" size={24} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Activité récente
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-700">Nouvelle réservation</span>
                    <span className="text-sm text-gray-500">Il y a 2h</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-700">Nouvel utilisateur</span>
                    <span className="text-sm text-gray-500">Il y a 5h</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Mise à jour hôtel</span>
                    <span className="text-sm text-gray-500">Il y a 1j</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Hôtels populaires
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-700">Hôtel Dakar Palace</span>
                    <span className="text-sm font-semibold text-primary">45 réservations</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-700">Saly Beach Resort</span>
                    <span className="text-sm font-semibold text-primary">38 réservations</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-700">Thiès Comfort Inn</span>
                    <span className="text-sm font-semibold text-primary">32 réservations</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
