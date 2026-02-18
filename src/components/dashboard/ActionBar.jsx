import React from 'react';
import { Plus, Search, FileText, BarChart3 } from 'lucide-react';
import Button from '../ui/Button';

export default function ActionBar({ onNewMission }) {
  return (
    <div className="bg-white border-b border-[#E2E8F0] px-6 py-3 w-full">
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="solid" onClick={onNewMission}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Document
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button variant="ghost">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistique
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"
            placeholder="Rechercher..."
          />
        </div>
      </div>
    </div>
  );
}

