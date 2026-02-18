import React, { useState } from 'react';
import Card from '../ui/Card';
import { X, Plus, ChevronDown } from 'lucide-react';
import LookupModal from './LookupModal';
import { intervenants } from '../../data/mockData';

export default function IntervenantsCard({ formData, readOnly, onUpdate }) {
  const [activeModal, setActiveModal] = useState(null);

  const handleSelect = (field, selection) => {
    onUpdate(field, selection);
    setActiveModal(null);
  };

  const handleRemove = (field, idToRemove) => {
    if (field === 'membres') {
      const current = formData.membres || [];
      onUpdate('membres', current.filter(m => m.id !== idToRemove));
    } else {
      onUpdate(field, null);
    }
  };

  // Helper for single select display
  const renderSingleSelect = (field, label) => {
    const selectedPerson = formData[field];

    if (readOnly) {
         return (
           <div className="flex items-center gap-2 px-3 py-2 border border-transparent">
             {selectedPerson ? (
                 <>
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                        {selectedPerson.avatar}
                    </div>
                    <span className="text-sm text-[#1E293B] font-medium">{selectedPerson.nom}</span>
                 </>
             ) : (
                <span className="text-sm text-gray-500">-</span>
             )}
           </div>
         );
    }

    if (selectedPerson) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs
                            font-semibold flex items-center justify-center flex-shrink-0">
            {selectedPerson.avatar}
            </div>
            <span className="text-sm text-[#1E293B] font-medium">{selectedPerson.nom}</span>
            <button
                onClick={() => handleRemove(field)}
                className="ml-auto text-[#94A3B8] hover:text-[#EF4444]"
                type="button"
            >
            <X className="w-3.5 h-3.5" />
            </button>
        </div>
      );
    }

    return (
        <button
            type="button"
            onClick={() => setActiveModal(field)}
            className="
                w-full px-3 py-2.5 text-left text-sm
                border border-[#E2E8F0] rounded-lg bg-white
                text-[#94A3B8] hover:border-[#2563EB]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
                transition-colors flex items-center justify-between
            "
        >
            <span>Sélectionner...</span>
            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
        </button>
    );
  };

  // Helper for multi select display (Membres)
  const renderMultiSelect = () => {
    const membres = formData.membres || [];

    if (readOnly) {
         if (membres.length === 0) return <span className="text-sm text-gray-500 px-3 py-2">-</span>;
         return (
            <div className="flex flex-wrap gap-2 px-2 py-1.5">
                {membres.map(m => (
                    <span key={m.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-medium">
                        <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px] font-bold flex items-center justify-center">{m.avatar}</span>
                        {m.nom}
                    </span>
                ))}
            </div>
         );
    }

    return (
        <div className="flex flex-wrap gap-2 min-h-[42px] px-2 py-1.5 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
            {membres.map(m => (
                <span key={m.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1
                                bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-medium">
                {/* Avatar circle */}
                <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[9px]
                                font-bold flex items-center justify-center">{m.avatar}</span>
                {m.nom}
                {/* Remove tag */}
                <button onClick={() => handleRemove('membres', m.id)}
                        type="button"
                        className="text-[#93C5FD] hover:text-[#2563EB] ml-0.5">
                    <X className="w-2.5 h-2.5" />
                </button>
                </span>
            ))}
            {/* Add more button if at least 1 is selected */}
            {membres.length > 0 && (
                <button onClick={() => setActiveModal('membres')}
                        type="button"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs
                                text-[#2563EB] hover:bg-[#EFF6FF] rounded-full transition-colors">
                <Plus className="w-3 h-3" /> Ajouter
                </button>
            )}
            {membres.length === 0 && (
                <button onClick={() => setActiveModal('membres')}
                        type="button"
                        className="text-sm text-[#94A3B8] px-1 w-full text-left"
                        >
                Sélectionner des membres...
                </button>
            )}
        </div>
    );
  };

  const modalColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'role', label: 'Rôle' },
    { key: 'departement', label: 'Département' }
  ];

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Intervenants</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Responsable Mission {!readOnly && <span className="text-red-500">*</span>}</label>
             {renderSingleSelect('responsable', 'Responsable Mission')}
          </div>
          <div className="flex flex-col space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Coordinateur {!readOnly && <span className="text-red-500">*</span>}</label>
             {renderSingleSelect('coordinateur', 'Coordinateur')}
          </div>
          <div className="flex flex-col space-y-1 md:col-span-2">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Membres {!readOnly && <span className="text-red-500">*</span>}</label>
             {renderMultiSelect()}
          </div>
          <div className="flex flex-col space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valideur {!readOnly && <span className="text-red-500">*</span>}</label>
             {renderSingleSelect('valideur', 'Valideur')}
          </div>
      </div>

      {activeModal && (
        <LookupModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title={`Sélectionner ${activeModal === 'membres' ? 'des membres' : activeModal}`}
            data={intervenants}
            columns={modalColumns}
            onSelect={(selection) => handleSelect(activeModal, selection)}
            multiSelect={activeModal === 'membres'}
        />
      )}
    </Card>
  );
}

