import React from 'react';
import { Navbar, Sidebar, Card } from '../components';
import { BarChart3, Users, Hotel, TrendingUp, RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const { stats, isLoading, refetch } = useDashboard();

  const statCards = [
    { label: 'Hôtels', value: stats.totalHotels, icon: Hotel, color: 'bg-blue-500' },
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-green-500' },
    { label: 'Réservations', value: stats.totalReservations, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Revenus', value: `${stats.totalRevenue}K`, icon: BarChart3, color: 'bg-orange-500' },
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
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {isLoading ? '...' : stat.value}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Activité récente
                  </h2>
                  <button
                    onClick={() => refetch()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
                <div className="space-y-3">
                  {stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-700">{activity.description}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucune activité récente</p>
                  )}
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Hôtels populaires
                </h2>
                <div className="space-y-3">
                  {stats.popularHotels.length > 0 ? (
                    stats.popularHotels.map((hotel) => (
                      <div key={hotel.id} className="flex items-center justify-between py-2 border-b">
                        <span className="text-gray-700">{hotel.name}</span>
                        <span className="text-sm font-semibold text-primary">
                          {hotel.reservations} réservations
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun hôtel populaire</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
