import React from 'react';
import Card from '../ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DecisionsSection({ decision, onChange, readOnly }) {
  // decision value: 'EXECUTION' | 'ANNULATION' | null

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Décision</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => !readOnly && onChange('EXECUTION')}
          disabled={readOnly}
          className={`
            relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            ${decision === 'EXECUTION' 
              ? 'border-green-500 bg-green-50 text-green-700' 
              : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/30 text-gray-600'}
            ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer'}
          `}
        >
          <CheckCircle className={`h-8 w-8 mb-3 ${decision === 'EXECUTION' ? 'text-green-600' : 'text-gray-400'}`} />
          <span className="font-bold text-sm">Exécution des Travaux</span>
          {decision === 'EXECUTION' && (
            <div className="absolute top-3 right-3 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          )}
        </button>

        <button
          type="button"
          onClick={() => !readOnly && onChange('ANNULATION')}
          disabled={readOnly}
          className={`
            relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
            ${decision === 'ANNULATION' 
              ? 'border-red-500 bg-red-50 text-red-700' 
              : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/30 text-gray-600'}
            ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer'}
          `}
        >
          <XCircle className={`h-8 w-8 mb-3 ${decision === 'ANNULATION' ? 'text-red-600' : 'text-gray-400'}`} />
          <span className="font-bold text-sm">Annuler les Travaux</span>
          {decision === 'ANNULATION' && (
            <div className="absolute top-3 right-3 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>
    </Card>
  );
}

