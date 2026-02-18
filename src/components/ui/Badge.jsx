import React from 'react';
import { statusConfig } from '../../data/mockData';

export default function Badge({ status }) {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

