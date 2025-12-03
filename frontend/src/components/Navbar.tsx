import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err);
      }
    }
  };

  useEffect(() => {
    // Charger les données utilisateur au montage
    loadUser();

    // Écouter les changements du localStorage
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  return (
    <nav className="bg-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold">
              R
            </div>
            <span className="font-bold text-lg">RED PRODUCT</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <Link to="/dashboard" className="hover:text-accent transition whitespace-nowrap">
              Tableau de bord
            </Link>
            <Link to="/hotels" className="hover:text-accent transition whitespace-nowrap">
              Hôtels
            </Link>
            
            {/* Profil Utilisateur */}
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-600">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {getInitials()}
              </div>
              <div className="min-w-0 max-w-xs">
                <p className="text-xs font-semibold truncate">
                  {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'Utilisateur'}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                  <p className="text-xs text-gray-300">en ligne</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-accent transition whitespace-nowrap text-sm"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-600 pt-4">
            {/* Profil Utilisateur Mobile */}
            <div className="flex items-center space-x-3 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'Utilisateur'}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-xs text-gray-300">en ligne</p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="block hover:text-accent transition px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              to="/hotels"
              className="block hover:text-accent transition px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Hôtels
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left hover:text-accent transition px-4 py-2 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
