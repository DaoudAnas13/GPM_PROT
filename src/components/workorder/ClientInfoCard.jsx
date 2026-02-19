import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Search } from 'lucide-react';
import LookupModal from './LookupModal';
import { clients } from '../../data/mockData';

export default function ClientInfoCard({ formData, readOnly, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (client) => {
    onUpdate('client', client);
    // Auto-fill fields
    onUpdate('clientId', client.id);
    onUpdate('raisonSociale', client.raisonSociale);
    onUpdate('direction', client.direction);
    onUpdate('demandeur', client.demandeur);
    onUpdate('responsableSite', client.responsableSite);
    onUpdate('matriculeFiscal', client.matriculeFiscal);
    onUpdate('email', client.email);
    onUpdate('telephone', client.telephone);
    onUpdate('adresse', client.adresse);
    setIsModalOpen(false);
  };

  const fields = [
    { key: 'raisonSociale', label: 'Raison Sociale' },
    { key: 'direction', label: 'Direction' },
    { key: 'demandeur', label: 'Demandeur' },
    { key: 'responsableSite', label: 'Responsable Site' },
    { key: 'matriculeFiscal', label: 'Matricule Fiscal' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'adresse', label: 'Adresse' },
  ];

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">Information Client</h3>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <Search className="h-4 w-4 mr-2" />
            Sélectionner Client
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {field.label}
              {!readOnly && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className={`relative rounded-lg ${formData.autoFilled ? 'border-l-[3px] border-l-[#10B981]' : ''}`}>
              <input
                type="text"
                value={formData[field.key] || ''}
                readOnly={true}
                className={`
                  w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg
                  bg-gray-50 text-gray-700 cursor-not-allowed
                  focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]
                  transition-colors
                  ${formData.autoFilled ? 'autofill-flash' : ''}
                `}
                placeholder={readOnly ? '-' : 'Sélectionner un client...'}
              />
            </div>
          </div>
        ))}
      </div>

      <LookupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sélectionner un Client"
        data={clients}
        columns={[
          { key: 'raisonSociale', label: 'Raison Sociale' },
          { key: 'matriculeFiscal', label: 'Matricule' },
          { key: 'direction', label: 'Direction' }
        ]}
        onSelect={handleSelect}
      />
    </Card>
  );
}

