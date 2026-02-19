import React, { useState, useMemo } from 'react';
import {
  FileText, Car, Users, Calendar, PanelLeftClose, PanelLeft,
  LayoutGrid, List, Search, Briefcase, CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { notesDeFrais, voitures, missions } from '../data/mockData';

// Constants
const CAR_STATUSES = [
  'Disponible',
  'En Mission',
  'Maintenance'
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

// Helper function to get status color for NF
const getNFStatusColor = (status) => {
  switch (status) {
    case 'creation': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'verification': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'validation direction technique': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'paiement': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'fin': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

// Helper function to get car status color
const getCarStatusColor = (status) => {
  switch (status) {
    case 'Disponible': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'En Mission': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};


export default function Ressources() {
  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resourceType, setResourceType] = useState('nf'); // 'nf' | 'voiture'
  const [groupBy, setGroupBy] = useState('all'); // 'all', 'beneficiaire', 'etape', 'date'
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' | 'table'
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
      carStatus: []
  });

  // Expanded Data for Note de Frais (Join with Mission)
  const expandedNF = useMemo(() => {
    return notesDeFrais.map(nf => {
      const mission = missions.find(m => m.id === nf.missionId);
      return {
        ...nf,
        missionTitle: mission ? mission.title : 'Mission Inconnue',
        dateDebutMission: mission ? mission.dateDebut : null
      };
    });
  }, []);

  // Filtered Data
  const filteredData = useMemo(() => {
    const term = search.toLowerCase();

    if (resourceType === 'nf') {
      return expandedNF.filter(item =>
        item.beneficiaire.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term) ||
        item.missionTitle.toLowerCase().includes(term)
      );
    } else {
      return voitures.filter(item => {
        const matchesSearch = item.immatriculation.toLowerCase().includes(term) ||
                              item.modele.toLowerCase().includes(term);
        const matchesStatus = filters.carStatus.length === 0 || filters.carStatus.includes(item.statut);

        return matchesSearch && matchesStatus;
      });
    }
  }, [resourceType, expandedNF, search, filters]);

  // Grouped Data
  const groupedData = useMemo(() => {
    if (groupBy === 'all') {
      return { [resourceType === 'nf' ? 'Toutes les Notes de Frais' : 'Toutes les Voitures']: filteredData };
    }

    return filteredData.reduce((acc, curr) => {
      let key = 'Autres';
      if (resourceType === 'nf') {
        if (groupBy === 'beneficiaire') key = curr.beneficiaire;
        if (groupBy === 'etape') key = curr.statut;
        if (groupBy === 'date') key = curr.dateDebutMission ? curr.dateDebutMission.substring(0, 7) : 'Date Inconnue'; // YYYY-MM
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    }, {});
  }, [filteredData, resourceType, groupBy]);


  const handleSidebarClick = (type, group) => {
    setResourceType(type);
    setGroupBy(group);
  };

  const toggleCarStatusFilter = (status) => {
      setFilters(prev => ({
          ...prev,
          carStatus: prev.carStatus.includes(status)
             ? prev.carStatus.filter(s => s !== status)
             : [...prev.carStatus, status]
      }));
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
          {sidebarOpen && <span className="font-bold text-gray-800 text-lg tracking-tight">Ressources</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md text-gray-500">
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 w-full px-2">

            {/* Note de Frais Section */}
            <div className="space-y-1">
               {sidebarOpen ? (
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Notes de Frais</h4>
               ) : (
                  <div className="h-px w-8 bg-gray-200 mx-auto mb-2"></div>
               )}

               {[
                 { id: 'all', label: 'Toutes les NF', icon: FileText },
                 { id: 'beneficiaire', label: 'Par Bénéficiaire', icon: Users },
                 { id: 'etape', label: 'Par Étape', icon: CheckCircle },
                 { id: 'date', label: 'Par Date début mission', icon: Calendar },
               ].map(item => (
                 <button
                    key={item.id}
                    onClick={() => handleSidebarClick('nf', item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      resourceType === 'nf' && groupBy === item.id 
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

            {/* Voitures Section */}
            <div className="space-y-1">
               {sidebarOpen ? (
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2 mt-6">Voitures</h4>
               ) : (
                  <div className="h-px w-8 bg-gray-200 mx-auto mb-2 mt-4"></div>
               )}

               <button
                  onClick={() => handleSidebarClick('voiture', 'all')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    resourceType === 'voiture'
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                  title={!sidebarOpen ? 'Toutes les voitures' : ''}
               >
                  <Car size={18} />
                  {sidebarOpen && <span>Toutes les voitures</span>}
               </button>
            </div>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
           <div>
               <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                   {resourceType === 'nf' ? 'Notes de Frais' : 'Voitures'}
               </h1>
               <p className="text-sm text-gray-500 mt-1">
                   {resourceType === 'nf' ? 'Gérez les notes de frais des intervenants.' : 'Suivez la flotte de véhicules.'}
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
                  placeholder={resourceType === 'nf' ? "Rechercher une NF, un bénéficiaire..." : "Rechercher une voiture, un modèle..."}
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
          <div className="flex items-center justify-between pb-1">
               {resourceType === 'voiture' ? (
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                       <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Statut:</span>
                       {CAR_STATUSES.map(status => (
                           <FilterPill
                               key={status}
                               label={status}
                               active={filters.carStatus.includes(status)}
                               onClick={() => toggleCarStatusFilter(status)}
                               colorClass="bg-blue-100 text-blue-700 border-blue-300"
                           />
                       ))}
                   </div>
               ) : (
                   <div></div>
               )}

               <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-auto">
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
                        {resourceType === 'nf' ? <FileText className="h-12 w-12 text-gray-400" /> : <Car className="h-12 w-12 text-gray-400" />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Aucun élément trouvé</h3>
                    <p className="text-gray-500 max-w-sm mt-2">Essayez d'ajuster votre recherche.</p>
                </div>
            )}

            {/* --- NOTE DE FRAIS VIEW --- */}
            {resourceType === 'nf' && filteredData.length > 0 && (
                <div className="space-y-8 pb-10">
                    {Object.entries(groupedData).map(([groupKey, items]) => (
                        <div key={groupKey} className="space-y-4">
                             {groupBy !== 'all' && (
                                <div className="flex items-center gap-3 sticky top-0 bg-[#F8FAFC] py-2 z-10 backdrop-blur-sm bg-opacity-90">
                                    <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">{groupKey}</h3>
                                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{items.length}</span>
                                </div>
                            )}

                            {viewMode === 'grouped' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {items.map((nf) => (
                                        <div key={nf.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-3">
                                                 <span className="font-mono text-[10px] text-gray-400">{nf.id}</span>
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getNFStatusColor(nf.statut)}`}>
                                                     {nf.statut}
                                                 </span>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    <span className="font-semibold text-gray-900 text-sm">{nf.beneficiaire}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Briefcase className="h-3 w-3" />
                                                    <span className="line-clamp-1">{nf.missionTitle}</span>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                                                    {/*<DollarSign className="h-4 w-4" />*/}
                                                    <span>{nf.montant.toFixed(3)} TND</span>
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {nf.date}
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
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bénéficiaire</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Mission</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Montant</th>
                                                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {items.map((nf, idx) => (
                                                <tr key={nf.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{nf.id}</td>
                                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{nf.beneficiaire}</td>
                                                    <td className="py-3 px-4 text-xs text-gray-600">{nf.missionTitle}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getNFStatusColor(nf.statut)}`}>
                                                            {nf.statut}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm font-mono text-emerald-600 text-right font-bold">{nf.montant.toFixed(3)}</td>
                                                    <td className="py-3 px-4 text-xs text-gray-500 text-right">{nf.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- VOITURES VIEW --- */}
            {resourceType === 'voiture' && filteredData.length > 0 && (
                <div className="space-y-8 pb-10">
                    {viewMode === 'grouped' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredData.map((voiture) => (
                            <div key={voiture.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Car className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getCarStatusColor(voiture.statut)}`}>
                                            {voiture.statut}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">{voiture.modele}</h4>
                                    <p className="text-sm font-mono text-gray-500 mt-1">{voiture.immatriculation}</p>
                                </div>

                                <div className="mt-4 space-y-2">
                                     <div className="flex items-center justify-between text-xs text-gray-600">
                                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Kilométrage</span>
                                         <span className="font-mono font-medium">{voiture.kilometrage ? `${voiture.kilometrage.toLocaleString()} km` : '-'}</span>
                                     </div>
                                     <div className="flex items-center justify-between text-xs text-gray-600">
                                         <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> Carburant</span>
                                         <span className="font-medium">{voiture.carburant || '-'}</span>
                                     </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-mono text-[10px]">{voiture.id}</span>
                                        <span className="font-medium text-blue-600 hover:underline">Voir détails</span>
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
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Immatriculation</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Modèle</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Kilométrage</th>
                                        <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Carburant</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.map((voiture, idx) => (
                                        <tr key={voiture.id} className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="py-3 px-4 text-xs font-mono text-gray-500">{voiture.id}</td>
                                            <td className="py-3 px-4 text-sm font-mono font-medium text-gray-900">{voiture.immatriculation}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{voiture.modele}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getCarStatusColor(voiture.statut)}`}>
                                                    {voiture.statut}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-mono text-gray-600 text-right">
                                                {voiture.kilometrage ? `${voiture.kilometrage.toLocaleString()} km` : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{voiture.carburant || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

        </div>
      </main>
    </div>
  );
}




