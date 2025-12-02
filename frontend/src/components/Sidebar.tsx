import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Hotel, Ticket, MessageSquare, Mail } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/hotels', label: 'Hôtels', icon: Hotel },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/emails', label: 'Emails', icon: Mail },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <nav className="space-y-2 px-4">
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
    </aside>
  );
};
