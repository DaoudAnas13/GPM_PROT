import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Button from '../ui/Button';

export default function HeaderActionBar({ onBack, stage, onSave, onSubmit, onEdit, id, isNew }) {
  const steps = [
    { label: 'Brouillon', stage: 1 },
    { label: 'Soumis', stage: 2 },
    { label: 'Validé', stage: 3 }
  ];

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ChevronLeft className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Retour</span>
          </Button>
          <div className="flex items-center text-sm font-medium text-gray-500">
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Missions</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-semibold">
              {isNew ? 'Nouveau' : id}
            </span>
          </div>
        </div>

        {/* Center: Stage Indicator */}
        <div className="hidden md:flex items-center space-x-1">
          {steps.map((step, idx) => (
            <React.Fragment key={step.stage}>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold
                  ${step.stage <= stage ? 'text-blue-700 bg-blue-50' : 'text-gray-400'}
                  ${step.stage === stage ? 'ring-1 ring-blue-700/20' : ''}
                `}
              >
                {step.stage < stage && <Check className="h-3 w-3" />}
                <span>{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 w-4 ${step.stage < stage ? 'bg-blue-200' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {stage === 1 ? (
            <>
              <Button variant="ghost" onClick={onBack}>Annuler</Button>
              <Button variant="outline" onClick={onSave}>Enregistrer Brouillon</Button>
              <Button variant="solid" onClick={onSubmit}>Soumettre</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onEdit}>Annuler</Button>
              <Button variant="solid" onClick={onSave} disabled={true}>Modifier</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

