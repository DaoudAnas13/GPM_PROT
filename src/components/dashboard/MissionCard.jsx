import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ChevronLeft, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import Button from '../ui/Button';

export default function MissionCard({ title, data, type = 'list', total = 0, onRowClick, isLoading = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  if (isLoading) {
    return (
      <Card className="h-full min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
               <div className="h-12 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Calculate pagination
  const start = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(start, start + pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderContent = () => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">Aucune donnée disponible</p>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left relative">
            <thead>
              <tr>
                <th className="sticky top-0 bg-white z-10 pb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold shadow-sm">Mission</th>
                <th className="sticky top-0 bg-white z-10 pb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold shadow-sm">Chef</th>
                <th className="sticky top-0 bg-white z-10 pb-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold text-right shadow-sm">Statut</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`h-14 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${idx === paginatedData.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" /> {item.dateDebut}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600 line-clamp-1">{item.chef}</td>
                  <td className="py-3 text-right">
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (type === 'grouped') {
        const grouped = data.reduce((acc, curr) => {
            const key = curr.chef || 'Non assigné';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return (
            <div className="space-y-3">
                {Object.entries(grouped).map(([chef, count], idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white">
                                {chef.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{chef}</span>
                        </div>
                        <span className="inline-flex items-center justify-center bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded shadow-sm border border-gray-100 min-w-[2rem]">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'status') {
         const statuses = ['En Cours', 'En Attente', 'Terminé', 'Annulé'];
         const counts = statuses.map(status => ({
             status,
             count: data.filter(d => d.status === status).length
         }));

         return (
             <div className="space-y-3">
                 {counts.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                         <Badge status={item.status} />
                         <span className="font-semibold text-gray-900">{item.count}</span>
                     </div>
                 ))}
             </div>
         );
    }

    return null;
  };

  return (
    <Card className="flex flex-col h-full min-h-[420px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">{title}</h3>
        <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {total || data.length}
        </span>
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>

      {(type === 'list' && totalPages > 1) && (
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
          <span>{start + 1}–{Math.min(start + pageSize, data.length)} sur {data.length}</span>
          <div className="flex gap-1">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

