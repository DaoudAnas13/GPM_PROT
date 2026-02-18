import React, { useState } from 'react';
import Card from '../ui/Card';
import Toggle from '../ui/Toggle';
import { Search, ChevronDown, Calendar } from 'lucide-react';
import LookupModal from './LookupModal';
import { projets, villes, zones, motifs, voitures, clients } from '../../data/mockData';

export default function GlobalInfoCard({ formData, readOnly, onUpdate, onUpdateFields }) {
  const [activeModal, setActiveModal] = useState(null);

  const lookupConfig = {
    projet: {
      title: 'Sélectionner Projet',
      data: projets,
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'nom', label: 'Nom' },
        { key: 'statut', label: 'Statut' }
      ]
    },
    ville: {
      title: 'Sélectionner Ville',
      data: villes,
      columns: [
        { key: 'nom', label: 'Nom' }
      ]
    },
    zone: {
      title: 'Sélectionner Zone',
      data: zones, // Filter by Ville? Prompt says "Nom · (Ville liée)"
      columns: [
        { key: 'nom', label: 'Nom' },
        { key: 'villeId', label: 'Ville liée' } // This is ID, ideally we show name, but for now ID is in data
      ]
    },
    voiture: {
      title: 'Sélectionner Voiture',
      data: voitures,
      columns: [
        { key: 'immatriculation', label: 'Immatriculation' },
        { key: 'modele', label: 'Modèle' },
        { key: 'statut', label: 'Statut' }
      ]
    },
    motif: {
      title: 'Sélectionner Motif',
      data: motifs,
      columns: [
        { key: 'libelle', label: 'Libellé' }
      ]
    }
  };

  const handleSelect = (field, item) => {
    if (field === 'projet') {
      const updates = {
        projet: item, // Store full object
        projetId: item.code // Store code/display value
      };

      // Fix 3: Project -> Client Cascade
      const linkedClient = clients.find(c => c.id === item.clientId);
      if (linkedClient) {
        updates.client = linkedClient;
        updates.raisonSociale = linkedClient.raisonSociale;
        updates.direction = linkedClient.direction;
        updates.demandeur = linkedClient.demandeur;
        updates.responsableSite = linkedClient.responsableSite;
        updates.matriculeFiscal = linkedClient.matriculeFiscal;
        updates.email = linkedClient.email;
        updates.telephone = linkedClient.telephone;
        updates.adresse = linkedClient.adresse;
        updates.autoFilled = true; // For Fix 3 visual cue (handled in ClientInfoCard)
      }

      onUpdateFields(updates);
    } else {
      // For other fields, we just update the field value
      // We might want to store more than just the string if we want "code" vs "name"
      // But formData structure in useWorkOrderState uses strings for these.
      // ville: string, zone: string, etc.
      // The prompt says "The selected value label updates in the trigger button."
      // Let's store the display value.
      let value = '';
      if (field === 'ville') value = item.nom;
      if (field === 'zone') value = item.nom;
      if (field === 'voiture') value = `${item.immatriculation} - ${item.modele}`;
      if (field === 'motif') value = item.libelle;

      onUpdate(field, value);
    }
    setActiveModal(null);
  };

  const LookupTriggerButton = ({ value, placeholder, onClick, disabled }) => (
    <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="
            w-full px-3 py-2.5 text-left text-sm
            border border-[#E2E8F0] rounded-lg bg-white
            text-[#1E293B] hover:border-[#2563EB]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#2563EB] focus-visible:ring-offset-2
            transition-colors flex items-center justify-between
            disabled:opacity-60 disabled:cursor-not-allowed
        "
    >
        <span className={value ? 'text-[#1E293B]' : 'text-[#94A3B8]'}>
            {value || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
    </button>
  );

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Information Globale</h3>
      </div>

      <div className="space-y-6">
        {/* Project Lookup */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Projet {!readOnly && <span className="text-red-500">*</span>}
          </label>
          {readOnly ? (
               <p className="text-sm text-gray-900 font-bold py-2 border-b border-gray-100">
                  {formData.projetId || '-'}
               </p>
          ) : (
             <LookupTriggerButton
                value={formData.projetId}
                placeholder="Sélectionner un projet..."
                onClick={() => setActiveModal('projet')}
            />
          )}
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['ville', 'zone', 'voiture', 'motif'].map((field) => (
            <div key={field} className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {field} {!readOnly && <span className="text-red-500">*</span>}
              </label>
              {readOnly ? (
                 <p className="text-sm text-gray-900 font-medium py-2 border-b border-gray-100">
                    {formData[field] || '-'}
                 </p>
              ) : (
                 <LookupTriggerButton
                    value={formData[field]}
                    placeholder={`Sélectionner...`}
                    onClick={() => setActiveModal(field)}
                 />
              )}
            </div>
          ))}

          {['dateDebut', 'dateFin'].map((field) => (
            <div key={field} className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {field.replace(/([A-Z])/g, ' $1').trim()} {!readOnly && <span className="text-red-500">*</span>}
              </label>
              {readOnly ? (
                 <p className="text-sm text-gray-900 font-medium py-2 border-b border-gray-100 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formData[field] ? new Date(formData[field]).toLocaleString() : '-'}
                 </p>
              ) : (
                <input
                  type="datetime-local"
                  value={formData[field] || ''}
                  onChange={(e) => onUpdate(field, e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg
                             focus:outline-none focus:border-[#2563EB] focus:ring-1
                             focus:ring-[#2563EB] transition-colors"
                />
              )}
            </div>
          ))}
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Toggle
            label="Mission de Nuit"
            checked={formData.isNuit}
            onChange={(val) => !readOnly && onUpdate('isNuit', val)}
          />
          <Toggle
            label="Avec Hébergement"
            checked={formData.isHebergement}
            onChange={(val) => !readOnly && onUpdate('isHebergement', val)}
          />
        </div>
      </div>

      {activeModal && lookupConfig[activeModal] && (
        <LookupModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            title={lookupConfig[activeModal].title}
            columns={lookupConfig[activeModal].columns}
            data={lookupConfig[activeModal].data}
            onSelect={(item) => handleSelect(activeModal, item)}
        />
      )}
    </Card>
  );
}
