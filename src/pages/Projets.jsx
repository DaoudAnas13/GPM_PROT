import React, { useState, useMemo } from 'react';
import {
  Building, Calendar,
  PanelLeftClose, PanelLeft, LayoutGrid, List, Search, Briefcase, FileText
} from 'lucide-react';
import { projets, clients } from '../data/mockData';

// Constants
const STATUSES = [
  'Brouillon',
  'Cloture projet',
  'Etude opportunité',
  'Execution des travaux',
  'Fin'
];

// Helper Component: Filter Pill
const FilterPill = ({ label, active, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
      active 
        ? `${colorClass} ring-2 ring-offset-1 ring-blue-100` 
        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Brouillon': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Etude opportunité': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Execution des travaux': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Cloture projet': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Fin': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

export default function Projets() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'table'
  const [groupBy, setGroupBy] = useState('all'); // 'all', 'status', 'client'
  const [filters, setFilters] = useState({
    search: '',
    status: [], // array of strings
    client: '',
  });

  // Derived Data
  // Enrich projects with Client info
  const enrichedProjects = useMemo(() => {
    return projets.map(projet => {
      const clientObj = clients.find(c => c.id === projet.clientId);
      return {
        ...projet,
        clientName: clientObj ? clientObj.raisonSociale : 'Client Inconnu',
        clientSector: clientObj ? clientObj.secteur : 'N/A'
      };
    });
  }, []);

  const uniqueClients = useMemo(() => [...new Set(enrichedProjects.map(p => p.clientName))], [enrichedProjects]);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return enrichedProjects.filter(p => {
      // Search
      const searchMatch = !filters.search ||
        p.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(filters.search.toLowerCase());

      // Status
      const statusMatch = filters.status.length === 0 || filters.status.includes(p.statut);

      // Client
      const clientMatch = !filters.client || p.clientName === filters.client;

      return searchMatch && statusMatch && clientMatch;
    });
  }, [filters, enrichedProjects]);

  // Grouped Data
  const groupedData = useMemo(() => {
    if (groupBy === 'all') {
      return { 'Tous les projets': filteredProjects };
    }

    return filteredProjects.reduce((acc, curr) => {
      let key = '';
      if (groupBy === 'status') {
        key = curr.statut || 'Sans Statut';
      } else if (groupBy === 'client') {
        key = curr.clientName || 'Sans Client';
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredProjects, groupBy]);

  // Handlers
  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleReset = () => {
    setFilters({ search: '', status: [], client: '' });
  };

  const currentGroupLabel = () => {
      if(groupBy === 'all') return 'Tous les projets';
      if(groupBy === 'status') return 'Par Étape';
      if(groupBy === 'client') return 'Par Client';
      return 'Projets';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 ${
          sidebarOpen ? 'w-64' : 'w-16'
        } ${!sidebarOpen ? 'items-center' : ''}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 w-full">
          {sidebarOpen && <span className="font-bold text-gray-800 text-lg tracking-tight">Projets</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500">
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 w-full">
            <div className={!sidebarOpen ? 'px-2' : 'px-4'}>
              {sidebarOpen && <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">VUES</h4>}
              <div className="space-y-1">
                 <button
                    onClick={() => setGroupBy('all')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      groupBy === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Tous les projets"
                 >
                    <List size={18} />
                    {sidebarOpen && <span>Tous les projets</span>}
                 </button>

                 <button
                    onClick={() => setGroupBy('status')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      groupBy === 'status' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Par Étape"
                 >
                    <FileText size={18} />
                    {sidebarOpen && <span>Par Étape</span>}
                 </button>

                 <button
                    onClick={() => setGroupBy('client')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      groupBy === 'client' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    title="Par Client"
                 >
                    <Building size={18} />
                    {sidebarOpen && <span>Par Client</span>}
                 </button>
              </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
           <div>
               <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{currentGroupLabel()}</h1>
               <p className="text-sm text-gray-500 mt-1">Gérez vos projets et suivez leur avancement.</p>
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
                  placeholder="Rechercher par nom, code, client..."
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
                 <LayoutGrid size={16} /> <span className="hidden sm:inline">Grille</span>
               </button>
               <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <List size={16} /> <span className="hidden sm:inline">Liste</span>
               </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pb-1">
             {/* Status Filter Pills */}
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
               <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Statut:</span>
               {STATUSES.map(status => (
                 <FilterPill
                  key={status}
                  label={status}
                  active={filters.status.includes(status)}
                  onClick={() => toggleStatusFilter(status)}
                  colorClass="bg-blue-100 text-blue-700 border-blue-300"
                 />
               ))}
             </div>

             {/* Client Dropdown */}
             <select
               className="text-xs font-medium bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-500 hover:border-gray-300 ml-auto sm:ml-2"
               value={filters.client}
               onChange={(e) => setFilters(prev => ({...prev, client: e.target.value}))}
             >
                <option value="">Tous les Clients</option>
                {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
             </select>

             {/* Reset & Count */}
             {(filters.search || filters.status.length > 0 || filters.client) && (
                <button onClick={handleReset} className="text-xs text-red-500 hover:underline font-medium ml-2">
                    Réinitialiser
                </button>
             )}
             <span className="text-xs text-gray-400 font-medium ml-2 whitespace-nowrap">
                {filteredProjects.length} projets
             </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">

            {/* Empty State */}
            {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <Briefcase className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Aucun projet trouvé</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.</p>
                    <button onClick={handleReset} className="mt-6 text-blue-600 font-medium hover:underline">Réinitialiser les filtres</button>
                </div>
            )}

            {/* Grouped View (Cards) */}
            {viewMode === 'grouped' && filteredProjects.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, groupProjects]) => (
                        <div key={groupKey} className="space-y-4">
                            {/* Group Header */}
                            {groupBy !== 'all' && (
                                <div className="flex items-center gap-3 sticky top-0 bg-[#F8FAFC] py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                    <h3 className="text-base font-bold text-gray-800">{groupKey}</h3>
                                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{groupProjects.length}</span>
                                </div>
                            )}

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {groupProjects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between h-full"
                                    >
                                        <div>
                                            {/* Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                 <div className="bg-blue-50 text-blue-700 font-mono text-[10px] px-2 py-1 rounded border border-blue-100 font-semibold">
                                                     {project.code}
                                                 </div>
                                                 <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusColor(project.statut)}`}>
                                                     {project.statut}
                                                 </span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                                                {project.nom}
                                            </h4>

                                            {/* Client */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                                    {project.clientName.substring(0,2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-gray-900 line-clamp-1">{project.clientName}</span>
                                                    <span className="text-[10px] text-gray-500">{project.clientSector}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Info */}
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>Début: {project.dateDebut || 'N/A'}</span>
                                            </div>
                                            {project.budget && (
                                                <span className="font-mono font-medium text-gray-700">
                                                    {project.budget.toLocaleString()} TND
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && filteredProjects.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, groupProjects]) => (
                        <div key={groupKey} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Group Header */}
                            {groupBy !== 'all' && (
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-base font-bold text-gray-800">{groupKey}</h3>
                                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{groupProjects.length}</span>
                                </div>
                            )}

                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Code</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Nom du Projet</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Client</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Statut</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Budget</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right">Date Début</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {groupProjects.map((project, idx) => (
                                        <tr key={project.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="py-3 px-4">
                                                <span className="font-mono text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{project.code}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-sm text-gray-900">{project.nom}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm font-medium text-gray-700">{project.clientName}</div>
                                                <div className="text-xs text-gray-400">{project.clientSector}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusColor(project.statut)}`}>
                                                     {project.statut}
                                                 </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-mono text-gray-600">
                                                {project.budget ? `${project.budget.toLocaleString()} TND` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500 text-right">
                                                {project.dateDebut || '-'}
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

