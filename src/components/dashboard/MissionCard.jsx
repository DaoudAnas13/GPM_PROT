import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import {
  ChevronLeft, ChevronRight, AlertCircle, Calendar,
  MapPin, User, Briefcase, Activity
} from 'lucide-react';
import Button from '../ui/Button';

const getStatusBorder = (status) => {
  switch (status) {
    case 'Creation': return 'border-l-4 border-l-blue-500';
    case 'Execution des Travaux': return 'border-l-4 border-l-emerald-500';
    case 'Verification WorkOrder': return 'border-l-4 border-l-red-500';
    case 'Fin': return 'border-l-4 border-l-green-600';
    case 'Validation': return 'border-l-4 border-l-amber-500';
    case 'Affectation Devis': return 'border-l-4 border-l-slate-400';
    default: return 'border-l-4 border-l-gray-300';
  }
};

export default function MissionCard({ title, data, total = 0, onRowClick, isLoading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('Toutes');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 5;

  // Filter Logic
  const filteredData = data.filter(item => {
    const matchesStatus = filterStatus === 'Toutes' || item.status === filterStatus;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const displayTotal = filteredData.length;
  const start = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(start, start + pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
       <Card className="h-full min-h-[400px]">
          <div className="animate-pulse space-y-4">
             <div className="h-8 bg-gray-200 rounded w-1/4"></div>
             <div className="h-10 bg-gray-200 rounded"></div>
             <div className="h-24 bg-gray-200 rounded"></div>
             <div className="h-24 bg-gray-200 rounded"></div>
          </div>
       </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h3>
          <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {displayTotal} missions
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 bg-gray-50 border"
          >
            <option value="Toutes">Toutes</option>
            <option value="Affectation Devis">Affectation Devis</option>
            <option value="Creation">Creation</option>
            <option value="Execution des Travaux">Execution des Travaux</option>
            <option value="Fin">Fin</option>
            <option value="Validation">Validation</option>
            <option value="Validation Ressources">Validation Ressources</option>
            <option value="Validation Technique">Validation Technique</option>
            <option value="Verification WorkOrder">Verification WorkOrder</option>
          </select>

          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 w-full sm:w-48 bg-white"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Aucune mission trouvée</p>
          </div>
        ) : (
          paginatedData.map((mission) => (
            <div
              key={mission.id}
              onClick={() => onRowClick && onRowClick(mission)}
              className={`group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer overflow-hidden ${getStatusBorder(mission.status)}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                        <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {mission.title}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Briefcase className="h-3.5 w-3.5" /> {mission.client}
                        </p>
                    </div>
                    <Badge status={mission.status} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{mission.ville}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{mission.dateDebut}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{mission.chef}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className={`h-4 w-4 ${mission.priorite === 'Haute' ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className={mission.priorite === 'Haute' ? 'font-medium text-red-600' : ''}>{mission.priorite || 'Moyenne'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500">Progression</span>
                  <span className="text-xs font-bold text-gray-700">{mission.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      mission.status === 'Verification WorkOrder' ? 'bg-red-500' : 
                      mission.status === 'Fin' ? 'bg-green-500' : 
                      mission.status === 'Execution des Travaux' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${mission.progress || 0}%` }}
                  ></div>
                </div>
              </div>

               {/* Hover Action */}
               <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                  <Button size="sm" variant="outline">Voir détails</Button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-xs text-gray-500">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="flex gap-2">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

