import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function DataTable({ columns, data, onRowClick, selectedIds = [] }) {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter(row =>
    columns.every(col => {
      if (!filters[col.key]) return true;
      const cellValue = row[col.key] ? String(row[col.key]).toLowerCase() : '';
      return cellValue.includes(filters[col.key].toLowerCase());
    })
  );

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée disponible</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {/* Minimal width column for selection indicator if needed */}
            <th className="w-8 sticky top-0 bg-white z-10 border-b border-gray-200"></th>
            {columns.map(col => (
              <th key={col.key} className="sticky top-0 bg-white z-10 p-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200 shadow-sm">
                <div className="flex flex-col gap-2">
                  <span>{col.label}</span>
                  {/* Filter input inline */}
                  <input
                    type="text"
                    placeholder={`Filtrer...`}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-blue-500 font-normal"
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row) => {
              const isSelected = selectedIds.includes(row.id);
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    h-12 cursor-pointer transition-all border-b border-[#E2E8F0]
                    ${isSelected
                      ? 'bg-[#EFF6FF] border-l-4 border-l-[#2563EB]'
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }
                  `}
                >
                  <td className="pl-4 pr-2 w-8 align-middle">
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <span className="w-4 h-4 block" />
                    )}
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="px-3 text-sm text-[#1E293B] py-3 align-middle">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                Aucun résultat
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

