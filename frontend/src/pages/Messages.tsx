import React, { useState, useEffect } from 'react';
import { Send, Trash2, Search } from 'lucide-react';
import { Button, Navbar, Sidebar } from '../components';
import Swal from 'sweetalert2';
import api from '../lib/api';

let loadingAlert: any = null;

interface Message {
  id: number;
  sender: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  recipient: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    recipient_id: '',
    content: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      }
    }
    fetchMessages();
    fetchUsers();
  }, []);

  // Afficher/masquer l'alerte de chargement
  useEffect(() => {
    if (isLoading) {
      loadingAlert = Swal.fire({
        title: 'Chargement des messages',
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

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/messages/');
      const messagesArray = Array.isArray(response.data) ? response.data : (response.data.results || response.data.data || []);
      setMessages(messagesArray);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users/');
      const data = response.data;
      console.log('Users data:', data);
      let usersArray = [];
      
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.results) {
        usersArray = data.results;
      } else if (data.data) {
        usersArray = data.data;
      }
      
      setUsers(usersArray);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le message ne peut pas être vide',
      });
      return;
    }

    if (!formData.recipient_id) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner un destinataire',
      });
      return;
    }

    try {
      await api.post('/messages/', {
        recipient_id: parseInt(formData.recipient_id),
        content: formData.content,
      });

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Message envoyé avec succès',
        timer: 1500,
      });
      setFormData({ recipient_id: '', content: '' });
      setShowForm(false);
      fetchMessages();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'envoi du message',
      });
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce message?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/messages/${id}/`);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Message supprimé avec succès',
          timer: 1500,
        });
        fetchMessages();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression du message',
        });
      }
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserName = (user: User) => {
    return `${user.first_name} ${user.last_name}`.trim() || user.email;
  };

  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white p-4 sm:p-6 shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Send size={20} />
                <span>Envoyer un message</span>
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSendMessage} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Envoyer un nouveau message
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire
                  </label>
                  <select
                    value={formData.recipient_id}
                    onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {users.length === 0 ? 'Aucun utilisateur disponible' : 'Sélectionner un destinataire'}
                    </option>
                    {users.length > 0 && users
                      .filter((user) => currentUser ? user.id !== currentUser.id : true)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {getUserName(user)}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Écrivez votre message..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" variant="primary">
                    Envoyer
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ recipient_id: '', content: '' });
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
                  placeholder="Rechercher un message..."
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
                <p className="text-gray-500">Chargement des messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Aucun message trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg shadow p-4 hover:shadow-md transition ${
                      message.is_read ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {currentUser?.id === message.sender.id ? 'À: ' : 'De: '}
                            {currentUser?.id === message.sender.id
                              ? getUserName(message.recipient)
                              : getUserName(message.sender)}
                          </p>
                          {!message.is_read && currentUser?.id === message.recipient.id && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              Non lu
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{message.content}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
