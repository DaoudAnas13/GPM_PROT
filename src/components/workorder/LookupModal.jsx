import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';

export default function LookupModal({ isOpen, onClose, title, columns, data, onSelect, multiSelect = false }) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (isOpen) setSelectedItems([]);
  }, [isOpen]);

  const handleRowClick = (row) => {
    if (multiSelect) {
      const isSelected = selectedItems.find(i => i.id === row.id);
      if (isSelected) {
        setSelectedItems(prev => prev.filter(i => i.id !== row.id));
      } else {
        setSelectedItems(prev => [...prev, row]);
      }
    } else {
      onSelect(row);
      onClose();
    }
  };

  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto">
          <DataTable
            columns={columns}
            data={data}
            onRowClick={handleRowClick}
            selectedIds={selectedItems.map(i => i.id)}
          />
        </div>

        {multiSelect && (
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0] mt-4">
            <span className="text-sm text-[#64748B]">
              {selectedItems.length} sélectionné{selectedItems.length !== 1 ? 's' : ''}
            </span>
            <Button
                onClick={handleConfirm}
                disabled={selectedItems.length === 0}
                className="px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1D4ED8] transition-colors"
                variant="solid" // Keeping variant but overriding className just in case Button component handles it weirdly, but className usually wins
            >
              Confirmer
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

