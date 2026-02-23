import React, { useState } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', path: '/dashboard' },
    { name: 'Missions', path: '/missions' },
    { name: 'Clients', path: '/clients' },
    { name: 'Projets', path: '/projets' },
    { name: 'Ressources', path: '/ressources' },
    { name: 'Facturation', path: '/facturation' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
            <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
                onClick={toggleMenu}
            >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/dashboard" className="text-[#2563EB] font-bold text-xl">
                GPM
            </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors border-b-2 ${
                isActive(link.path)
                  ? 'text-[#2563EB] font-semibold border-[#2563EB] py-5'
                  : 'text-[#64748B] border-transparent hover:text-[#2563EB] hover:border-gray-300 py-5'
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
            <span className="text-sm font-medium text-[#1E293B] hidden lg:block">
              Bienvenue, Admin
            </span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          <Button variant="ghost" size="sm" className="text-[#64748B] hidden sm:flex">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
        {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden bg-white border-b border-gray-200 shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
                <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                    ? 'bg-blue-50 text-[#2563EB]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                >
                {link.name}
                </Link>
            ))}
             <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">
                        AD
                        </div>
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-medium leading-none text-gray-800">Admin</div>
                        <div className="text-sm font-medium leading-none text-gray-500">admin@example.com</div>
                    </div>
                </div>
                 <div className="mt-3 px-2 space-y-1">
                 <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                  <div className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                    </div>
                  </button>
                </div>
             </div>
            </div>
        </div>
        )}
    </nav>
  );
}

