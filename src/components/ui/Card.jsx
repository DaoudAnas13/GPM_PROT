import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-[12px] shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

