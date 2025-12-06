import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Hotel, Ticket, MessageSquare, Mail, LogOut, Menu, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/hotels', label: 'Hôtels', icon: Hotel },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/emails', label: 'Emails', icon: Mail },
  ];

  useEffect(() => {
    // Récupérer les données utilisateur depuis le localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return '?';
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  // Fermer le menu quand on change de route
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Bouton hamburger (visible sur mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (visible quand sidebar est ouverte sur mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 bg-gray-900 text-white h-screen shadow-lg flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <nav className="space-y-2 px-4 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Section Profil Utilisateur */}
        <div className="border-t border-gray-700 p-4 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'Utilisateur'}
              </p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <p className="text-xs text-gray-400">en ligne</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 text-sm"
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
