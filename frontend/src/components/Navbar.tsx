import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
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

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="hover:text-accent transition">
              Tableau de bord
            </Link>
            <Link to="/hotels" className="hover:text-accent transition">
              Hôtels
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-accent transition"
            >
              <LogOut size={20} />
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
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/dashboard"
              className="block hover:text-accent transition"
              onClick={() => setIsOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              to="/hotels"
              className="block hover:text-accent transition"
              onClick={() => setIsOpen(false)}
            >
              Hôtels
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left hover:text-accent transition"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
