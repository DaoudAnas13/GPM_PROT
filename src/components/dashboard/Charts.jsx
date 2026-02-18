import React from 'react';

export const SimpleDonutChart = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center h-full gap-8">
      <div className="relative w-40 h-40 shrink-0">
        <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
          {data.map((slice, i) => {
            const startPercent = cumulativePercent;
            const slicePercent = slice.value / total;
            cumulativePercent += slicePercent;
            const endPercent = cumulativePercent;

            if (slicePercent === 1) {
              return <circle key={i} cx="0" cy="0" r="1" fill={slice.color} />;
            }

            const startX = Math.cos(2 * Math.PI * startPercent);
            const startY = Math.sin(2 * Math.PI * startPercent);
            const endX = Math.cos(2 * Math.PI * endPercent);
            const endY = Math.sin(2 * Math.PI * endPercent);

            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            const pathData = [
              `M 0 0`,
              `L ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ');

            return <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.05" />;
          })}
          {/* Inner circle for donut effect */}
          <circle cx="0" cy="0" r="0.6" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-2xl font-bold text-gray-800">{total}</span>
          <span className="text-xs text-gray-500 font-medium">Missions</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-w-[140px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600 flex-1">{item.label}</span>
            <span className="text-sm font-bold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleBarChart = ({ data, height = 200 }) => {
    // data: [{ label, value }]
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full h-full flex items-end justify-between gap-2 pt-8 pb-4" style={{ height: `${height}px` }}>
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div className="flex flex-col justify-end items-center w-full h-full relative">
                         <span className="text-xs font-semibold text-gray-600 mb-1">
                            {item.value}
                        </span>
                        <div
                            className="w-full max-w-[40px] rounded-t-md transition-all duration-300 hover:opacity-80"
                            style={{
                                height: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: '#1D4ED8' || `hsl(${210 + (idx * 30)}, 70%, 50%)`,
                                minHeight: '4px'
                            }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 mt-2 truncate w-full text-center font-medium">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export const SimpleHorizontalBarChart = ({ data }) => {
    // data: [{ label, value, color }]
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full flex flex-col gap-4">
            {data.map((item, idx) => (
                <div key={idx} className="w-full">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                            className="h-2.5 rounded-full transition-all duration-500"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color || '#3b82f6'
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};



