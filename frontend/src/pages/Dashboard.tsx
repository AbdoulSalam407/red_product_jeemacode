import React, { useState, useEffect } from 'react';
import { Navbar, Sidebar, Card } from '../components';
import { BarChart3, Users, Hotel, TrendingUp, RefreshCw, Ticket, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../lib/api';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const Dashboard: React.FC = () => {
  const { stats, isLoading, refetch } = useDashboard();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);

  useEffect(() => {
    // Charger les données utilisateur
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      }
    }
    
    // Charger les tickets, messages et emails
    fetchDashboardData();
  }, []);

  // Afficher/masquer l'alerte de chargement des statistiques
  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: 'Chargement des statistiques',
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

  const fetchDashboardData = async () => {
    try {
      // Récupérer les tickets
      const ticketsRes = await api.get('/tickets/');
      const ticketsData = ticketsRes.data;
      const ticketsArray = Array.isArray(ticketsData) ? ticketsData : (ticketsData.results || ticketsData.data || []);
      setTickets(ticketsArray.slice(0, 5));

      // Récupérer les messages
      const messagesRes = await api.get('/messages/');
      const messagesData = messagesRes.data;
      const messagesArray = Array.isArray(messagesData) ? messagesData : (messagesData.results || messagesData.data || []);
      setMessages(messagesArray.slice(0, 5));

      // Récupérer les emails
      const emailsRes = await api.get('/emails/');
      const emailsData = emailsRes.data;
      const emailsArray = Array.isArray(emailsData) ? emailsData : (emailsData.results || emailsData.data || []);
      setEmails(emailsArray.slice(0, 5));
    } catch (error) {
      console.error('Erreur lors du chargement des données du dashboard:', error);
    }
  };

  const statCards = [
    { label: 'Hôtels', value: stats.totalHotels, icon: Hotel, color: 'bg-blue-500' },
    { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'bg-green-500' },
    { label: 'Réservations', value: stats.totalReservations, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Revenus', value: `${stats.totalRevenue}K`, icon: BarChart3, color: 'bg-orange-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Message de bienvenue */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-white">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Bienvenue, {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'Utilisateur'} ! 👋
              </h1>
              <p className="text-sm sm:text-base lg:text-lg opacity-90">
                Vous avez {tickets.length} ticket(s), {messages.length} message(s) et {emails.length} email(s) en attente.
              </p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

            {/* Grille principale */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Tickets récents */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Ticket size={20} className="text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Tickets récents</h2>
                  </div>
                  <Link to="/tickets" className="text-primary text-sm hover:underline">
                    Voir tous
                  </Link>
                </div>
                <div className="space-y-3">
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <div key={ticket.id} className="py-2 border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium text-sm">{ticket.title}</p>
                            <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Fermé'}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority === 'low' ? 'Basse' : ticket.priority === 'medium' ? 'Moyenne' : 'Haute'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun ticket</p>
                  )}
                </div>
              </Card>

              {/* Messages récents */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={20} className="text-green-500" />
                    <h2 className="text-xl font-bold text-gray-900">Messages récents</h2>
                  </div>
                  <Link to="/messages" className="text-primary text-sm hover:underline">
                    Voir tous
                  </Link>
                </div>
                <div className="space-y-3">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div key={message.id} className="py-2 border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium text-sm truncate">
                              {user?.id === message.sender.id ? `À: ${message.recipient.first_name}` : `De: ${message.sender.first_name}`}
                            </p>
                            <p className="text-gray-600 text-xs truncate">{message.content}</p>
                          </div>
                          {!message.is_read && user?.id === message.recipient.id && (
                            <AlertCircle size={16} className="text-blue-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun message</p>
                  )}
                </div>
              </Card>

              {/* Emails récents */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail size={20} className="text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900">Emails récents</h2>
                  </div>
                  <Link to="/emails" className="text-primary text-sm hover:underline">
                    Voir tous
                  </Link>
                </div>
                <div className="space-y-3">
                  {emails.length > 0 ? (
                    emails.map((email) => (
                      <div key={email.id} className="py-2 border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium text-sm truncate">{email.subject}</p>
                            <p className="text-gray-600 text-xs truncate">{email.recipient}</p>
                          </div>
                          {email.is_sent ? (
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0 ml-2" />
                          ) : (
                            <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun email</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Activité récente et Hôtels populaires */}
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
