import React from 'react';
import Card from '../ui/Card';

export default function StatCard({ title, value, subtext, icon: Icon, trend, trendValue, color }) {
  const isPositive = trend === 'up';

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {(subtext || trendValue) && (
        <div className="mt-auto flex items-center justify-between">
           {trendValue && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? '+' : ''}{trendValue}
            </span>
           )}
           <span className="text-xs text-gray-400">{subtext}</span>
        </div>
      )}
    </Card>
  );
}

