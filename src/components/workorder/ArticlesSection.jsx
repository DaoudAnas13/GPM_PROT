import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Plus, Trash2, Lock } from 'lucide-react';
import LookupModal from './LookupModal';
import { articles as mockArticles } from '../../data/mockData';

export default function ArticlesSection({ stage, articles, onAdd, onRemove, onUpdateQuantity }) {
  const isLocked = stage < 2;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (selectedItems) => {
    if (Array.isArray(selectedItems)) {
        selectedItems.forEach(item => {
            const existingIds = articles.map(a => a.id);
            if (!existingIds.includes(item.id)) {
                onAdd(item);
            }
        });
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'designation', label: 'Désignation' },
    { key: 'unite', label: 'Unité' }
  ];

  return (
    <Card className="relative overflow-hidden min-h-[300px]">
        {/* Overlay for Stage 1 (Locked) */}
        {isLocked && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6 border border-gray-100 rounded-xl">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <Lock className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                    Soumettez le formulaire pour ajouter des articles.
                </p>
            </div>
        )}

        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Articles & Consommables</h3>
            {!isLocked && (
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Article
            </Button>
            )}
        </div>

        <div className="overflow-x-auto border rounded-lg border-gray-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                        <th className="pl-6 pr-3 py-3 w-10 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Code</th>
                        <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Désignation</th>
                        <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Unité</th>
                        <th className="px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Quantité</th>
                        <th className="px-3 py-3 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((row, index) => (
                        <tr key={row._id || row.id} // prefer unique ID
                            className={`h-14 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors group ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                            {/* Index number */}
                            <td className="pl-6 pr-3 w-10 text-sm text-[#94A3B8] font-medium">
                                {index + 1}
                            </td>
                            {/* Code */}
                            <td className="px-3 text-sm text-[#64748B] font-mono w-28">
                                {row.code}
                            </td>
                            {/* Désignation */}
                            <td className="px-3 text-sm text-[#1E293B] font-medium">
                                {row.designation}
                            </td>
                            {/* Unité */}
                            <td className="px-3 text-sm text-[#64748B] w-24">
                                {row.unite}
                            </td>
                            {/* Quantité — inline editable */}
                            <td className="px-3 w-28">
                                <input
                                    type="number"
                                    min={1}
                                    value={row.quantity || 1}
                                    onChange={e => onUpdateQuantity(row._id, e.target.value)}
                                    disabled={isLocked}
                                    className="w-20 px-3 py-1.5 text-sm border border-[#E2E8F0] rounded-lg
                                            text-center focus:outline-none focus:border-[#2563EB]
                                            focus:ring-1 focus:ring-[#2563EB]"
                                />
                            </td>
                            {/* Delete */}
                            <td className="pr-6 w-12 text-right">
                                {!isLocked && (
                                    <button
                                        onClick={() => onRemove(row._id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity
                                                text-[#CBD5E1] hover:text-[#EF4444]"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {!isLocked && articles.length === 0 && (
                         <tr>
                            <td colSpan="6" className="py-8 text-center text-gray-500 italic">
                              Aucun article ajouté.
                            </td>
                          </tr>
                    )}
                </tbody>
            </table>
        </div>

        {isModalOpen && (
             <LookupModal
                isOpen={true}
                onClose={() => setIsModalOpen(false)}
                title="Sélectionner Articles"
                data={mockArticles}
                columns={columns}
                onSelect={handleSelect}
                multiSelect={true}
            />
        )}
    </Card>
  );
}
