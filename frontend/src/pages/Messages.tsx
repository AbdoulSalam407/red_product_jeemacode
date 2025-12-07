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
  // Charger les données en cache au démarrage
  const cachedMessages = localStorage.getItem('messages_cache');
  const [messages, setMessages] = useState<Message[]>(cachedMessages ? JSON.parse(cachedMessages) : []);
  const [searchTerm, setSearchTerm] = useState('');
  // ✅ CORRIGER: Toujours charger si pas de cache valide
  const cacheTime = localStorage.getItem('messages_cache_time');
  const now = Date.now();
  const isCacheValid = cacheTime && (now - parseInt(cacheTime)) < 2 * 60 * 1000;
  const [isLoading, setIsLoading] = useState(!isCacheValid);
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
    try {
      setIsLoading(true);
      const response = await api.get('/messages/');
      console.log('Messages response:', response.data); // Debug
      
      // Gérer la pagination Django REST Framework
      let messagesArray: Message[] = [];
      if (Array.isArray(response.data)) {
        messagesArray = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        messagesArray = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        messagesArray = response.data.data;
      }
      
      console.log('Messages array:', messagesArray); // Debug
      console.log('Messages count:', messagesArray.length); // Debug
      
      setMessages(messagesArray);
      
      // Mettre en cache les données
      const cacheKey = 'messages_cache';
      localStorage.setItem(cacheKey, JSON.stringify(messagesArray));
      localStorage.setItem(cacheKey + '_time', Date.now().toString());
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

    // ✅ Créer un message optimiste
    const optimisticId = -Math.random();
    const recipientId = parseInt(formData.recipient_id);
    const recipient = users.find(u => u.id === recipientId);

    const optimisticMessage: Message = {
      id: optimisticId,
      sender: currentUser!,
      recipient: recipient!,
      content: formData.content,
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // ✅ Ajouter le message optimiste immédiatement
      setMessages(prev => [optimisticMessage, ...prev]);
      
      // ✅ Invalider le cache
      localStorage.removeItem('messages_cache');
      localStorage.removeItem('messages_cache_time');

      // Envoyer la requête en arrière-plan
      const response = await api.post('/messages/', {
        recipient_id: recipientId,
        content: formData.content,
      });

      // ✅ Remplacer le message optimiste par la vraie réponse
      setMessages(prev => prev.map(m => m.id === optimisticId ? response.data : m));

      Swal.fire({
        icon: 'success',
        title: '✅ Message envoyé',
        text: 'Votre message a été envoyé avec succès',
        timer: 2000,
        timerProgressBar: true,
      });
      
      setFormData({ recipient_id: '', content: '' });
      setShowForm(false);
    } catch (error: any) {
      // ✅ Rollback en cas d'erreur
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      
      console.error('Erreur lors de l\'envoi du message:', error);
      const message = error.response?.data?.detail || 'Erreur lors de l\'envoi du message';
      const errorDetails = error.response?.data || {};
      
      Swal.fire({
        icon: 'error',
        title: '❌ Erreur d\'envoi',
        html: `<div style="text-align: left;">
          <p><strong>Message:</strong> ${message}</p>
          ${Object.keys(errorDetails).length > 0 ? `<p><strong>Détails:</strong></p><pre style="text-align: left; background: #f3f4f6; padding: 10px; border-radius: 5px; overflow-x: auto;">${JSON.stringify(errorDetails, null, 2)}</pre>` : ''}
        </div>`,
        confirmButtonText: 'Réessayer',
        confirmButtonColor: '#ef4444',
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
      // ✅ Sauvegarder l'état précédent
      const previousMessages = messages;

      try {
        // ✅ Supprimer le message immédiatement
        setMessages(prev => prev.filter(m => m.id !== id));
        
        // ✅ Invalider le cache
        localStorage.removeItem('messages_cache');
        localStorage.removeItem('messages_cache_time');

        // Envoyer la requête en arrière-plan
        await api.delete(`/messages/${id}/`);

        Swal.fire({
          icon: 'success',
          title: '✅ Message supprimé',
          text: 'Le message a été supprimé avec succès',
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error: any) {
        // ✅ Restaurer l'état précédent en cas d'erreur
        setMessages(previousMessages);

        console.error('Erreur lors de la suppression:', error);
        const message = error.response?.data?.detail || 'Erreur lors de la suppression du message';
        
        Swal.fire({
          icon: 'error',
          title: '❌ Erreur de suppression',
          text: message,
          confirmButtonColor: '#ef4444',
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
              <form onSubmit={handleSendMessage} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Envoyer un message
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire
                  </label>
                  <select
                    value={formData.recipient_id}
                    onChange={(e) => setFormData({ ...formData, recipient_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
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
