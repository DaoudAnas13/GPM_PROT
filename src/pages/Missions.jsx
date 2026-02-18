import React, { useState, useMemo } from 'react';
import {
  Building, MapPin, Calendar,
  PanelLeftClose, PanelLeft, LayoutGrid, List, Search
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { missions, projets, clients } from '../data/mockData';

// Constants
const STATUS_OPTIONS = [
  'Affectation Devis',
  'Creation',
  'Execution des Travaux',
  'Fin',
  'Validation',
  'Validation Ressources',
  'Validation Technique',
  'Verification WorkOrder'
];
const PRIORITY_OPTIONS = ['Haute', 'Moyenne', 'Faible'];

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

// Helper Component: KPI Tile
const KPITile = ({ title, value, color }) => (
  <div className={`bg-white p-4 rounded-xl border-l-[6px] shadow-sm flex flex-col justify-between h-24 ${color}`}>
    <span className="text-gray-500 text-xs font-bold uppercase tracking-wide">{title}</span>
    <span className="text-3xl font-extrabold text-gray-800">{value}</span>
  </div>
);

// Helper function to get chef hex color from name (consistent)
const getChefColor = (name) => {
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Missions() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'table'
  const [groupBy, setGroupBy] = useState('chef'); // 'chef', 'creation', 'debut'
  const [filters, setFilters] = useState({
    search: '',
    status: [], // array of strings
    priority: '',
    ville: '',
    type: '',
    dateStart: '',
    dateEnd: ''
  });

  // Derived Data
  const uniqueVilles = useMemo(() => [...new Set(missions.map(m => m.ville))], []);
  const uniqueTypes = useMemo(() => [...new Set(missions.map(m => m.type || 'Standard'))], []);

  // Enrich missions with Project info
  const enrichedMissions = useMemo(() => {
    return missions.map(mission => {
      // Find client ID
      // Approx match for demo since mock data has slight inconsistencies
      const clientObj = clients.find(c =>
        c.raisonSociale.includes(mission.client) || mission.client.includes(c.raisonSociale)
      );

      let project = 'Projet Non Assigné';
      if (clientObj) {
         // Find a project for this client
         const clientProjects = projets.filter(p => p.clientId === clientObj.id);
         if (clientProjects.length > 0) {
            // Deterministic assignment based on mission ID char code
            const index = mission.id.charCodeAt(mission.id.length - 1) % clientProjects.length;
            project = clientProjects[index].nom;
         }
      }
      return { ...mission, project };
    });
  }, []);

  // Filter Logic
  const filteredMissions = useMemo(() => {
    return enrichedMissions.filter(m => {
      // Search
      const searchMatch = !filters.search ||
        m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.client.toLowerCase().includes(filters.search.toLowerCase()) ||
        (m.chef && m.chef.toLowerCase().includes(filters.search.toLowerCase())) ||
        m.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        m.project.toLowerCase().includes(filters.search.toLowerCase());

      // Status
      const statusMatch = filters.status.length === 0 || filters.status.includes(m.status);

      // Priority
      const priorityMatch = !filters.priority || m.priorite === filters.priority;

      // Ville
      const villeMatch = !filters.ville || m.ville === filters.ville;

      // Type
      const typeMatch = !filters.type || (m.type || 'Standard') === filters.type;

      // Date Range (simple string ISO compare for mock)
      const dateMatch = (!filters.dateStart || m.dateDebut >= filters.dateStart) &&
                        (!filters.dateEnd || m.dateDebut <= filters.dateEnd);

      return searchMatch && statusMatch && priorityMatch && villeMatch && typeMatch && dateMatch;
    });
  }, [filters]);

  // KPIs
  const kpis = {
    total: filteredMissions.length,
    execution: filteredMissions.filter(m => m.status === 'Execution des Travaux').length,
    verification: filteredMissions.filter(m => m.status === 'Verification WorkOrder').length,
    fin: filteredMissions.filter(m => m.status === 'Fin').length,
  };

  // Grouped Data
  const groupedData = useMemo(() => {
    return filteredMissions.reduce((acc, curr) => {
      let key = '';
      if (groupBy === 'chef') {
        key = curr.chef || 'Non assigné';
      } else if (groupBy === 'client') {
        key = curr.client || 'Sans Client';
      } else if (groupBy === 'projet') {
        key = curr.project || 'Projet Non Assigné';
      } else if (groupBy === 'creation') {
        key = curr.dateCreation ? curr.dateCreation.substring(0, 7) : 'Date inconnue'; // YYYY-MM
      } else if (groupBy === 'debut') {
        key = curr.dateDebut ? curr.dateDebut.substring(0, 7) : 'Date inconnue';
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredMissions, viewMode, groupBy]);

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
    setFilters({ search: '', status: [], priority: '', ville: '', type: '', dateStart: '', dateEnd: '' });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">

      {/* ...existing code... */}

      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 ${
          sidebarOpen ? 'w-64' : 'w-16'
        } ${!sidebarOpen ? 'items-center' : ''}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && <span className="font-bold text-gray-800 text-lg tracking-tight">Missions</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500">
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
            <div className={!sidebarOpen ? 'px-2' : 'px-4'}>
              {sidebarOpen && <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">CONSULTATION</h4>}
              <div className="space-y-1">
                 {[
                    { id: 'chef', label: 'Par Chef Mission', icon: LayoutGrid },
                    { id: 'client', label: 'Par Client', icon: Building },
                    { id: 'projet', label: 'Par Projet', icon: Building },
                    { id: 'creation', label: 'Par Date de création', icon: Calendar },
                    { id: 'debut', label: 'Par Date début', icon: Calendar },
                 ].map((item) => (
                   <div
                      key={item.id}
                      onClick={() => { setGroupBy(item.id); setViewMode('grouped'); }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        groupBy === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 text-gray-500'
                      }`}
                   >
                      <item.icon size={18} className={groupBy === item.id ? 'text-blue-600' : 'text-gray-400'} />
                      {sidebarOpen && <span className={`text-sm font-medium ${groupBy === item.id ? 'text-blue-900' : ''}`}>{item.label}</span>}
                   </div>
                 ))}
              </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* SECTION 2: KPIS */}
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <KPITile title="Total Missions" value={kpis.total} color="border-l-blue-500" />
          <KPITile title="Execution des Travaux" value={kpis.execution} color="border-l-indigo-500" />
          <KPITile title="Verification WorkOrder" value={kpis.verification} color="border-l-red-500" />
          <KPITile title="Fin" value={kpis.fin} color="border-l-emerald-500" />
        </div>

        {/* SECTION 3: FILTER BAR */}
        <div className="bg-white border-y border-gray-200 px-6 py-3 flex flex-col gap-4 shadow-sm z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Search */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher une mission, un client..."
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
             {/* Status Filters */}
             <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100 pr-3">
               <span className="text-[10px] font-bold text-gray-400 uppercase pl-3">Statut</span>
               {STATUS_OPTIONS.map(status => (
                 <FilterPill
                    key={status}
                    label={status}
                    active={filters.status.includes(status)}
                    onClick={() => toggleStatusFilter(status)}
                    colorClass={{
                        'Affectation Devis': 'bg-slate-100 text-slate-700 border-slate-300',
                        'Creation': 'bg-blue-100 text-blue-700 border-blue-300',
                        'Execution des Travaux': 'bg-emerald-100 text-emerald-700 border-emerald-300',
                        'Fin': 'bg-green-100 text-green-700 border-green-300',
                        'Validation': 'bg-amber-100 text-amber-700 border-amber-300',
                        'Validation Ressources': 'bg-orange-100 text-orange-700 border-orange-300',
                        'Validation Technique': 'bg-purple-100 text-purple-700 border-purple-300',
                        'Verification WorkOrder': 'bg-red-100 text-red-700 border-red-300'
                    }[status]}
                 />
               ))}
             </div>

             {/* Priority Filters */}
             <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100 pr-3">
               <span className="text-[10px] font-bold text-gray-400 uppercase pl-3">Priorité</span>
               {PRIORITY_OPTIONS.map(priority => (
                 <FilterPill
                    key={priority}
                    label={priority}
                    active={filters.priority === priority}
                    onClick={() => setFilters(prev => ({...prev, priority: prev.priority === priority ? '' : priority}))}
                    colorClass={{
                        'Haute': 'text-red-600 border-red-300 bg-red-50',
                        'Moyenne': 'text-amber-600 border-amber-300 bg-amber-50',
                        'Faible': 'text-gray-500 border-gray-300 bg-gray-50'
                    }[priority]}
                 />
               ))}
             </div>

             {/* Dropdowns */}
             <select
               className="text-xs font-medium bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-500 hover:border-gray-300"
               value={filters.ville}
               onChange={(e) => setFilters(prev => ({...prev, ville: e.target.value}))}
             >
                <option value="">Toutes les Villes</option>
                {uniqueVilles.map(v => <option key={v} value={v}>{v}</option>)}
             </select>

             <select
               className="text-xs font-medium bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-blue-500 hover:border-gray-300"
               value={filters.type}
               onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
             >
                <option value="">Tous les Types</option>
                {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
             </select>

             {/* Date Range */}
             <div className="flex items-center gap-2 text-xs border border-gray-200 rounded-md px-2 py-1 bg-white">
                <span className="text-gray-400">Du</span>
                <input type="date" className="outline-none w-24" value={filters.dateStart} onChange={(e) => setFilters(prev => ({...prev, dateStart: e.target.value}))} />
                <span className="text-gray-400">Au</span>
                <input type="date" className="outline-none w-24" value={filters.dateEnd} onChange={(e) => setFilters(prev => ({...prev, dateEnd: e.target.value}))} />
             </div>

             {/* Reset & Count */}
             {(filters.search || filters.status.length > 0 || filters.ville || filters.type || filters.dateStart) && (
                <button onClick={handleReset} className="text-xs text-red-500 hover:underline font-medium ml-auto sm:ml-0">
                    Réinitialiser
                </button>
             )}
             <span className="text-xs text-gray-400 font-medium ml-auto">
                {filteredMissions.length} missions affichées
             </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">

            {/* Empty State */}
            {filteredMissions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Aucune mission trouvée</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.</p>
                    <button onClick={handleReset} className="mt-6 text-blue-600 font-medium hover:underline">Réinitialiser les filtres</button>
                </div>
            )}

            {/* Grouped View */}
            {viewMode === 'grouped' && filteredMissions.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([chef, chefMissions]) => (
                        <div key={chef} className="space-y-4">
                            {/* Group Header */}
                            <div className="flex items-center gap-3 sticky top-0 bg-[#F8FAFC] py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getChefColor(chef)}`}>
                                    {chef.split(' ').map(n=>n[0]).join('').substring(0,2)}
                                </div>
                                <h3 className="text-base font-bold text-gray-800">{chef}</h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{chefMissions.length}</span>
                                <div className="h-1 flex-1 bg-gray-200 rounded-full max-w-[100px] ml-4 overflow-hidden">
                                     <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${Math.round(chefMissions.reduce((acc,m)=>acc+(m.progress||0),0)/chefMissions.length)}%` }}
                                     />
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {chefMissions.map((mission) => (
                                    <div
                                        key={mission.id}
                                        className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer overflow-hidden flex flex-col justify-between
                                            ${mission.status === 'Verification WorkOrder' ? 'border-l-[4px] border-l-red-500' : 'border-l-[4px] border-l-gray-300'}
                                            ${mission.status === 'Execution des Travaux' ? 'border-l-[4px] border-l-emerald-500' : ''}
                                            ${mission.status === 'Fin' ? 'border-l-[4px] border-l-green-600' : ''}
                                            ${mission.status === 'Creation' ? 'border-l-[4px] border-l-blue-400' : ''}
                                            ${mission.status === 'Validation' ? 'border-l-[4px] border-l-amber-400' : ''}
                                        `}
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-mono text-gray-400">{mission.id}</span>
                                                <Badge status={mission.status} />
                                            </div>

                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">{mission.title}</h4>

                                            <div className="space-y-1.5 mb-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Building className="h-3 w-3" /> <span className="truncate">{mission.client}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" /> <span>{mission.ville}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar className="h-3 w-3" /> <span>{mission.dateDebut} - {mission.dateFin && mission.dateFin.split('-').slice(1).join('/')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                           {/* Priority & Progress */}
                                           <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                                                    mission.priorite === 'Haute' ? 'text-red-600 border-red-200 bg-red-50' : 
                                                    mission.priorite === 'Moyenne' ? 'text-amber-600 border-amber-200 bg-amber-50' : 
                                                    'text-gray-500 border-gray-200 bg-gray-50'
                                                }`}>{mission.priorite}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{mission.progress || 0}%</span>
                                           </div>
                                           <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        (mission.progress || 0) === 100 ? 'bg-emerald-500' : 
                                                        (mission.progress || 0) > 79 ? 'bg-orange-500' : 
                                                        (mission.progress || 0) > 49 ? 'bg-amber-400' : 
                                                        (mission.progress || 0) > 0 ? 'bg-blue-500' : 'bg-gray-300'
                                                    }`}
                                                    style={{ width: `${mission.progress || 0}%` }}
                                                />
                                           </div>
                                           <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{mission.type || 'Standard'}</span>
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
            {viewMode === 'table' && filteredMissions.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, groupMissions]) => (
                        <div key={groupKey} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Group Header */}
                            <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
                                {groupBy === 'chef' && (
                                     <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${getChefColor(groupKey)}`}>
                                        {groupKey.split(' ').map(n=>n[0]).join('').substring(0,2)}
                                     </div>
                                )}
                                <h3 className="text-base font-bold text-gray-800">
                                    {groupKey}
                                </h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{groupMissions.length}</span>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Mission</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Client</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Ville</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Chef</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Début</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Priorité</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Statut</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Progression</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {groupMissions.map((mission, idx) => (
                                        <tr key={mission.id} className={`hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{mission.id}</td>
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-sm text-gray-900">{mission.title}</div>
                                                <div className="text-xs text-gray-400">{mission.type || 'Mission'}</div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{mission.client}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{mission.ville}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${getChefColor(mission.chef)}`}>
                                                        {mission.chef.split(' ').map(n=>n[0]).join('').substring(0,2)}
                                                    </div>
                                                    {mission.chef}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{mission.dateDebut}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                                    mission.priorite === 'Haute' ? 'text-red-700 bg-red-50 border-red-200' :
                                                    mission.priorite === 'Moyenne' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-gray-500 bg-gray-50 border-gray-200'
                                                }`}>{mission.priorite}</span>
                                            </td>
                                            <td className="py-3 px-4"><Badge status={mission.status} /></td>
                                            <td className="py-3 px-4 w-32">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${mission.progress || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8 text-right">{mission.progress || 0}%</span>
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


