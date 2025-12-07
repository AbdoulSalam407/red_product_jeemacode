import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { Button, Navbar, Sidebar } from '../components';
import Swal from 'sweetalert2';
import api from '../lib/api';

let loadingAlert: any = null;

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export const Tickets: React.FC = () => {
  // Charger les données en cache au démarrage
  const cachedTickets = localStorage.getItem('tickets_cache');
  const [tickets, setTickets] = useState<Ticket[]>(cachedTickets ? JSON.parse(cachedTickets) : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(!cachedTickets);
  const [showForm, setShowForm] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  // Afficher/masquer l'alerte de chargement
  useEffect(() => {
    if (isLoading) {
      loadingAlert = Swal.fire({
        title: 'Chargement des tickets',
        html: 'Veuillez patienter...',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    } else {
      if (loadingAlert) {
        Swal.close();
      }
    }
  }, [isLoading]);

  const fetchTickets = async () => {
    try {
      const cacheKey = 'tickets_cache';
      const cacheTime = localStorage.getItem(cacheKey + '_time');
      const now = Date.now();
      
      // Utiliser le cache si disponible et moins de 5 minutes
      if (cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          setTickets(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const response = await api.get('/tickets/');
      const ticketsArray = Array.isArray(response.data) ? response.data : (response.data.results || response.data.data || []);
      setTickets(ticketsArray);
      
      // Mettre en cache les données
      localStorage.setItem(cacheKey, JSON.stringify(ticketsArray));
      localStorage.setItem(cacheKey + '_time', now.toString());
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le titre du ticket est requis',
      });
      return;
    }

    try {
      if (editingTicketId) {
        await api.put(`/tickets/${editingTicketId}/`, formData);
      } else {
        await api.post('/tickets/', formData);
      }

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: editingTicketId ? 'Ticket modifié avec succès' : 'Ticket créé avec succès',
        timer: 1500,
      });
      setFormData({ title: '', description: '', priority: 'medium' });
      setEditingTicketId(null);
      setShowForm(false);
      fetchTickets();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: editingTicketId ? 'Erreur lors de la modification du ticket' : 'Erreur lors de la création du ticket',
      });
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicketId(ticket.id);
    setFormData({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
    });
    setShowForm(true);
  };

  const handleDeleteTicket = async (id: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce ticket?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tickets/${id}/`);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Ticket supprimé avec succès',
          timer: 1500,
        });
        fetchTickets();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression du ticket',
        });
      }
    }
  };

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

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white p-4 sm:p-6 shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tickets</h1>
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus size={20} />
                <span>Ajouter un ticket</span>
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleAddTicket} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingTicketId ? 'Modifier le ticket' : 'Créer un nouveau ticket'}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre du ticket
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre du ticket"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du ticket"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" variant="primary">
                    {editingTicketId ? 'Mettre à jour' : 'Créer le ticket'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTicketId(null);
                      setFormData({ title: '', description: '', priority: 'medium' });
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            )}

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Chargement des tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Aucun ticket trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="p-2 text-gray-400 hover:text-primary transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Ouvert' : ticket.status === 'in_progress' ? 'En cours' : 'Fermé'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'low' ? 'Basse' : ticket.priority === 'medium' ? 'Moyenne' : 'Haute'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
