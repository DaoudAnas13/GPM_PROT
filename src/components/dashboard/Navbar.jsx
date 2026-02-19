import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/dashboard' },
    { name: 'Missions', path: '/missions' },
    { name: 'Clients', path: '/clients' },
    { name: 'Projets', path: '/projets' },
    { name: 'Statistiques', path: '/stats' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/dashboard" className="text-[#2563EB] font-bold text-xl">GPM</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-[#2563EB] font-semibold border-b-2 border-[#2563EB] py-5'
                  : 'text-[#64748B] hover:text-[#2563EB] py-5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">
              AD
            </div>
            <span className="text-sm font-medium text-[#1E293B] hidden sm:block">
              Bienvenue, Admin
            </span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <Button variant="ghost" size="sm" className="text-[#64748B]">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  );
}

