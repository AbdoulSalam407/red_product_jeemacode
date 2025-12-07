import React, { useState, useEffect } from 'react';
import { Send, Trash2, Search, CheckCircle } from 'lucide-react';
import { Button, Navbar, Sidebar } from '../components';
import Swal from 'sweetalert2';
import api from '../lib/api';

let loadingAlert: any = null;

interface Email {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  is_sent: boolean;
  created_at: string;
  sent_at: string | null;
}

export const Emails: React.FC = () => {
  // Charger les données en cache au démarrage
  const cachedEmails = localStorage.getItem('emails_cache');
  const [emails, setEmails] = useState<Email[]>(cachedEmails ? JSON.parse(cachedEmails) : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(!cachedEmails);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  // Afficher/masquer l'alerte de chargement
  useEffect(() => {
    if (isLoading) {
      loadingAlert = Swal.fire({
        title: 'Chargement des emails',
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

  const fetchEmails = async () => {
    try {
      const cacheKey = 'emails_cache';
      const cacheTime = localStorage.getItem(cacheKey + '_time');
      const now = Date.now();
      
      // Utiliser le cache si disponible et moins de 5 minutes
      if (cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          setEmails(JSON.parse(cachedData));
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      const response = await api.get('/emails/');
      const emailsArray = Array.isArray(response.data) ? response.data : (response.data.results || response.data.data || []);
      setEmails(emailsArray);
      
      // Mettre en cache les données
      localStorage.setItem(cacheKey, JSON.stringify(emailsArray));
      localStorage.setItem(cacheKey + '_time', now.toString());
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error);
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipient.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'L\'adresse email du destinataire est requise',
      });
      return;
    }

    if (!formData.subject.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le sujet de l\'email est requis',
      });
      return;
    }

    if (!formData.body.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le contenu de l\'email est requis',
      });
      return;
    }

    try {
      await api.post('/emails/', formData);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Email créé avec succès',
        timer: 1500,
      });
      setFormData({ recipient: '', subject: '', body: '' });
      setShowForm(false);
      fetchEmails();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'envoi de l\'email',
      });
    }
  };

  const handleDeleteEmail = async (id: number) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cet email?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/emails/${id}/`);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Email supprimé avec succès',
          timer: 1500,
        });
        fetchEmails();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression de l\'email',
        });
      }
    }
  };

  const filteredEmails = emails.filter(
    (email) =>
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white p-4 sm:p-6 shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Emails</h1>
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Send size={20} />
                <span>Envoyer un email</span>
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSendEmail} className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  Envoyer un email
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinataire
                  </label>
                  <input
                    type="email"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    placeholder="exemple@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Sujet de l'email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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
                      setFormData({ recipient: '', subject: '', body: '' });
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
                  placeholder="Rechercher un email..."
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
                <p className="text-gray-500">Chargement des emails...</p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">Aucun email trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`rounded-lg shadow p-4 hover:shadow-md transition ${
                      email.is_sent ? 'bg-white' : 'bg-yellow-50 border-l-4 border-yellow-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            À: {email.recipient}
                          </p>
                          {email.is_sent && (
                            <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              <CheckCircle size={14} />
                              <span>Envoyé</span>
                            </span>
                          )}
                          {!email.is_sent && (
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                              En attente
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-800 mt-2">{email.subject}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{email.body}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteEmail(email.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(email.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {email.is_sent && email.sent_at && (
                        <span className="text-xs text-green-600">
                          Envoyé le {new Date(email.sent_at).toLocaleDateString('fr-FR')}
                        </span>
                      )}
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
