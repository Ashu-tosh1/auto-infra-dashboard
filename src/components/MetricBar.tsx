import React from 'react';

interface MetricBarProps {
  label: string;
  value: number;
  color?: string;
}

export const MetricBar: React.FC<MetricBarProps> = ({ 
  label, 
  value, 
  color = "blue" 
}) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-500">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);