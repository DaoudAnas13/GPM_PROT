import React, { useState, useMemo } from 'react';
import {
  FileText, Briefcase, Calendar, PanelLeftClose, PanelLeft,
  LayoutGrid, List, Search, CheckCircle, FileCheck, CheckSquare, Clock
} from 'lucide-react';
import { factures, devis } from '../data/mockData';

// Constants
const FACTURE_STATUSES = [
  'Creation',
  'Verification',
  'Paiement',
  'Décharge',
  'Fin'
];

const DEVIS_STATUSES = [
  'Creation',
  'Execution des Travaux',
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
const getStatusColor = (status, type) => {
  const s = status.toLowerCase();
  if (type === 'facture') {
      switch (s) {
        case 'creation': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'verification': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'paiement': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'décharge': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'fin': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-50 text-gray-500 border-gray-200';
      }
  } else {
      switch (s) {
        case 'creation': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'execution des travaux': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'fin': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-50 text-gray-500 border-gray-200';
      }
  }
};

export default function Facturation() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('factures'); // 'factures' | 'devis'
  const [groupBy, setGroupBy] = useState('all'); // 'all', 'encours', 'client', 'etape', 'date'
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'table'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    client: ''
  });

  // Derived Data
  const uniqueClients = useMemo(() => {
    const data = activeTab === 'factures' ? factures : devis;
    return [...new Set(data.map(item => item.client))].sort();
  }, [activeTab]);

  // Filtered Data
  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    const data = activeTab === 'factures' ? factures : devis;

    let filtered = data.filter(item => {
      const matchesSearch = item.client.toLowerCase().includes(term) ||
                            item.id.toLowerCase().includes(term) ||
                            item.status?.toLowerCase().includes(term); // Optional chaining just in case

      const matchesClient = !filters.client || item.client === filters.client;
      const matchesStatus = filters.status.length === 0 || filters.status.map(s => s.toLowerCase()).includes(item.statut.toLowerCase());

      return matchesSearch && matchesClient && matchesStatus;
    });

    // Apply specific "En cours" filter if selected via sidebar logic
    if (activeTab === 'factures' && groupBy === 'encours') {
        filtered = filtered.filter(f => f.statut.toLowerCase() !== 'fin');
    }

    // Sort by date descending (newest first)
    return filtered.sort((a, b) => {
        const dateA = new Date(a.dateCreation || 0);
        const dateB = new Date(b.dateCreation || 0);
        return dateB - dateA;
    });
  }, [activeTab, search, groupBy, filters]);

  // Grouped Data
  const groupedData = useMemo(() => {
    // If we just want a flat list (All or En Cours which is just a filter)
    if (groupBy === 'all' || groupBy === 'encours') {
        const label = activeTab === 'factures'
            ? (groupBy === 'encours' ? 'Factures en cours' : 'Toutes les factures')
            : 'Tous les devis';
        return { [label]: filteredData };
    }

    return filteredData.reduce((acc, curr) => {
      let key = 'Autres';

      if (groupBy === 'client') {
          key = curr.client;
      } else if (groupBy === 'etape') {
          key = curr.statut; // Using French 'statut' from mock data
      } else if (groupBy === 'date') {
          if (curr.dateCreation) {
             const date = new Date(curr.dateCreation);
             key = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
             // Capitalize first letter
             key = key.charAt(0).toUpperCase() + key.slice(1);
          } else {
             key = 'Date Inconnue';
          }
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredData, activeTab, groupBy]);

  const handleSidebarClick = (tab, group) => {
    setActiveTab(tab);
    setGroupBy(group);
    setFilters({ status: [], client: '' });
  };

  const toggleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleReset = () => {
    setFilters({ status: [], client: '' });
    setSearch('');
  };

  const currentStatuses = activeTab === 'factures' ? FACTURE_STATUSES : DEVIS_STATUSES;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">

      {/* SIDEBAR */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 ${
          sidebarOpen ? 'w-64' : 'w-16'
        } ${!sidebarOpen ? 'items-center' : ''}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 w-full">
          {sidebarOpen && <span className="font-bold text-gray-800 text-lg tracking-tight">Facturation</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500">
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 w-full px-2">

            {/* Facturation Section */}
            <div className="space-y-1">
               {sidebarOpen ? (
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Factures</h4>
               ) : (
                  <div className="h-px w-8 bg-gray-200 mx-auto mb-2"></div>
               )}

               {[
                 { id: 'all', label: 'Toutes les factures', icon: FileText },
                 { id: 'encours', label: 'En cours', icon: Clock },
                 { id: 'client', label: 'Par Client', icon: Briefcase },
                 { id: 'etape', label: 'Par Étape', icon: CheckCircle },
                 { id: 'date', label: 'Par Date création', icon: Calendar },
               ].map(item => (
                 <button
                    key={item.id}
                    onClick={() => handleSidebarClick('factures', item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'factures' && groupBy === item.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                 >
                    <item.icon size={18} />
                    {sidebarOpen && <span>{item.label}</span>}
                 </button>
               ))}
            </div>

            {/* Devis Section */}
            <div className="space-y-1">
               {sidebarOpen ? (
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-6">Devis</h4>
               ) : (
                  <div className="h-px w-8 bg-gray-200 mx-auto mb-2 mt-4"></div>
               )}

               {[
                 { id: 'all', label: 'Tous les devis', icon: FileCheck },
                 { id: 'date', label: 'Par Date', icon: Calendar },
                 { id: 'client', label: 'Par Client', icon: Briefcase },
                 { id: 'etape', label: 'Par Étape', icon: CheckSquare },
               ].map(item => (
                 <button
                    key={item.id}
                    onClick={() => handleSidebarClick('devis', item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                       activeTab === 'devis' && groupBy === item.id
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                    title={!sidebarOpen ? item.label : ''}
                 >
                    <item.icon size={18} />
                    {sidebarOpen && <span>{item.label}</span>}
                 </button>
               ))}
            </div>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
           <div>
               <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                   {activeTab === 'factures' ? 'Factures' : 'Devis'}
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                   {activeTab === 'factures' ? 'Gestion et suivi de la facturation client.' : 'Gestion et suivi des devis.'}
               </p>
           </div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-col gap-4 shadow-sm z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher par client, ID..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
               {currentStatuses.map(status => (
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
             {(search || filters.status.length > 0 || filters.client) && (
                <button onClick={handleReset} className="text-xs text-red-500 hover:underline font-medium ml-2">
                    Réinitialiser
                </button>
             )}
             <span className="text-xs text-gray-400 font-medium ml-2 whitespace-nowrap">
                {filteredData.length} résultats
             </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">

            {/* Empty State */}
            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Aucun élément trouvé</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Essayez d'ajuster votre recherche.</p>
                </div>
            )}

            <div className="space-y-8 pb-10">
                {Object.entries(groupedData).map(([groupKey, items]) => (
                    <div key={groupKey} className="space-y-4">
                         {/* Group Header */}
                         {items.length > 0 && typeof groupedData === 'object' && Object.keys(groupedData).length > 1 && (
                            <div className="flex items-center gap-3 sticky top-0 bg-[#F8FAFC] py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">{groupKey}</h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                            </div>
                         )}

                         {/* Specific handling for single group view title if needed, else redundant */}

                        {viewMode === 'grouped' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start mb-3">
                                                 <span className="font-mono text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded">{item.id}</span>
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusColor(item.statut, activeTab === 'factures' ? 'facture' : 'devis')}`}>
                                                     {item.statut}
                                                 </span>
                                            </div>

                                            <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{item.client}</h4>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Calendar className="h-3 w-3" />
                                                <span>{item.dateCreation}</span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-emerald-700 font-bold">
                                                {/*<DollarSign className="h-4 w-4" />*/}
                                                <span>{item.montant?.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-28">ID</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Client</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                            <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {items.map((item, idx) => (
                                            <tr key={item.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                <td className="py-3 px-4 text-xs font-mono text-gray-500">{item.id}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.client}</td>
                                                <td className="py-3 px-4 text-xs text-gray-600">{item.dateCreation}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusColor(item.statut, activeTab === 'factures' ? 'facture' : 'devis')}`}>
                                                        {item.statut}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm font-mono text-emerald-700 text-right font-bold">
                                                    {item.montant?.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
      </main>
    </div>
  );
}


