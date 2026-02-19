import React, { useState, useMemo } from 'react';
import {
  Building, MapPin, LayoutGrid, List, Search, Phone, Mail, User, Briefcase
} from 'lucide-react';
import { clients } from '../data/mockData';

// Constants
const SECTORS = [...new Set(clients.map(c => c.secteur))];

// Helper Component: Filter Pill
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
      active 
        ? 'bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-offset-1 ring-blue-100' 
        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

// Helper function to get sector color
const getSectorColor = (sector) => {
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < sector.length; i++) hash = sector.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Clients() {
  // State
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'table'
  const [groupBy, setGroupBy] = useState('secteur'); // 'secteur', 'ville'
  const [filters, setFilters] = useState({
    search: '',
    secteur: [],
    ville: ''
  });

  // Derived Data
  const uniqueVilles = useMemo(() => [...new Set(clients.map(c => c.ville))], []);

  // Filter Logic
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      // Search
      const searchMatch = !filters.search ||
        c.raisonSociale.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.ville.toLowerCase().includes(filters.search.toLowerCase());

      // Secteur
      const sectorMatch = filters.secteur.length === 0 || filters.secteur.includes(c.secteur);

      // Ville
      const villeMatch = !filters.ville || c.ville === filters.ville;

      return searchMatch && sectorMatch && villeMatch;
    });
  }, [filters]);

  // Grouped Data
  const groupedData = useMemo(() => {
    return filteredClients.reduce((acc, curr) => {
      let key = '';
      if (groupBy === 'secteur') {
        key = curr.secteur || 'Autre';
      } else if (groupBy === 'ville') {
        key = curr.ville || 'Inconnue';
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredClients, groupBy]);

  // Handlers
  const toggleSectorFilter = (sector) => {
    setFilters(prev => ({
      ...prev,
      secteur: prev.secteur.includes(sector)
        ? prev.secteur.filter(s => s !== sector)
        : [...prev.secteur, sector]
    }));
  };

  const handleReset = () => {
    setFilters({ search: '', secteur: [], ville: '' });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden px-12 py-6">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
           <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Clients</h1>
           <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Grouper par :</span>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setGroupBy('secteur')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${groupBy === 'secteur' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Secteur
                  </button>
                  <button
                    onClick={() => setGroupBy('ville')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${groupBy === 'ville' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Ville
                  </button>
              </div>
           </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-col gap-4 shadow-sm z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un client, une ville..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
               <button
                onClick={() => setViewMode('grouped')}
                className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'grouped' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <LayoutGrid size={16} /> <span className="hidden sm:inline">Groupée</span>
               </button>
               <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <List size={16} /> <span className="hidden sm:inline">Tableau</span>
               </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pb-1">
             {/* Sector Filters */}
             <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100 pr-3">
               <span className="text-[10px] font-bold text-gray-400 uppercase pl-3">Secteur</span>
               {SECTORS.map(sector => (
                 <FilterPill
                    key={sector}
                    label={sector}
                    active={filters.secteur.includes(sector)}
                    onClick={() => toggleSectorFilter(sector)}
                 />
               ))}
             </div>

             {/* Ville Dropdown */}
             <select
               className="text-xs font-medium bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-500 hover:border-gray-300"
               value={filters.ville}
               onChange={(e) => setFilters(prev => ({...prev, ville: e.target.value}))}
             >
                <option value="">Toutes les Villes</option>
                {uniqueVilles.map(v => <option key={v} value={v}>{v}</option>)}
             </select>

             {/* Reset & Count */}
             {(filters.search || filters.secteur.length > 0 || filters.ville) && (
                <button onClick={handleReset} className="text-xs text-red-500 hover:underline font-medium ml-auto sm:ml-0">
                    Réinitialiser
                </button>
             )}
             <span className="text-xs text-gray-400 font-medium ml-auto">
                {filteredClients.length} clients affichés
             </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">

            {/* Empty State */}
            {filteredClients.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <Building className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Aucun client trouvé</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.</p>
                    <button onClick={handleReset} className="mt-6 text-blue-600 font-medium hover:underline">Réinitialiser les filtres</button>
                </div>
            )}

            {/* Grouped View */}
            {viewMode === 'grouped' && filteredClients.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, groupClients]) => (
                        <div key={groupKey} className="space-y-4">
                            {/* Group Header */}
                            <div className="flex items-center gap-3 sticky top-0 bg-[#F8FAFC] py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getSectorColor(groupBy === 'secteur' ? groupKey : 'default')}`}>
                                    {groupKey.substring(0,2).toUpperCase()}
                                </div>
                                <h3 className="text-base font-bold text-gray-800">{groupKey}</h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{groupClients.length}</span>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupClients.map((client) => (
                                    <div
                                        key={client.id}
                                        className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer overflow-hidden flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-mono text-gray-400">{client.id}</span>
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                                    client.secteur === 'Énergie' ? 'text-amber-600 border-amber-200 bg-amber-50' : 
                                                    client.secteur === 'Télécom' ? 'text-blue-600 border-blue-200 bg-blue-50' : 
                                                    'text-gray-500 border-gray-200 bg-gray-50'
                                                }`}>{client.secteur}</span>
                                            </div>

                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{client.raisonSociale}</h4>

                                            <div className="space-y-1.5 mb-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" /> <span>{client.ville} - {client.adresse}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <User className="h-3 w-3" /> <span className="truncate">{client.demandeur}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Briefcase className="h-3 w-3" /> <span className="truncate">{client.direction}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-50 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{client.telephone}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate max-w-[150px]">{client.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && filteredClients.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, groupClients]) => (
                        <div key={groupKey} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Group Header */}
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-base font-bold text-gray-800">
                                    {groupKey}
                                </h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{groupClients.length}</span>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Raison Sociale</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Secteur</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Ville</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Contact</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Coordonnées</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {groupClients.map((client, idx) => (
                                        <tr key={client.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{client.id}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-sm text-gray-900">{client.raisonSociale}</div>
                                                <div className="text-xs text-gray-400">{client.matriculeFiscal}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                    client.secteur === 'Énergie' ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                                                    client.secteur === 'Télécom' ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                                                    'text-gray-500 bg-gray-50 border-gray-200'
                                                }`}>{client.secteur}</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{client.ville}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="font-medium">{client.demandeur}</div>
                                                <div className="text-xs text-gray-400">{client.direction}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-gray-400"/> {client.telephone}</span>
                                                    <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-gray-400"/> {client.email}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

