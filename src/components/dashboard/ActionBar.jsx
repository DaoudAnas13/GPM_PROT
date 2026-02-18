import React, { useState } from 'react';
import {
  Plus, Search, FileText, BarChart3,
  ClipboardList, Briefcase, Users, ShoppingCart,
  FileOutput, FolderOpen, Receipt, Car
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

export default function ActionBar({ onNewMission }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const documentTypes = [
    { id: 'mission', label: 'Ordre de Mission', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100', action: onNewMission },
    { id: 'affaire', label: 'Affaire', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'client', label: 'Client', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'commande', label: 'Commande Client', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'devis', label: 'Devis', icon: FileOutput, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'facture', label: 'Dossier Facturation', icon: FolderOpen, color: 'text-pink-600', bg: 'bg-pink-100' },
    { id: 'frais', label: 'Note de frais', icon: Receipt, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { id: 'voiture', label: 'Voitures', icon: Car, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  ];

  const handleDocumentSelect = (doc) => {
    setIsModalOpen(false);
    if (doc.action) {
      doc.action();
    }
  };

  return (
    <>
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-3 w-full">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid" onClick={() => setIsModalOpen(true)}>
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

          {/*<div className="relative">*/}
          {/*  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
          {/*    <Search className="h-4 w-4 text-gray-400" />*/}
          {/*  </div>*/}
          {/*  <input*/}
          {/*    type="text"*/}
          {/*    className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-[#E2E8F0] rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"*/}
          {/*    placeholder="Rechercher..."*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sélectionnez un type de document"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {documentTypes.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocumentSelect(doc)}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group bg-white"
            >
              <div className={`h-12 w-12 rounded-full ${doc.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <doc.icon className={`h-6 w-6 ${doc.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center">
                {doc.label}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
