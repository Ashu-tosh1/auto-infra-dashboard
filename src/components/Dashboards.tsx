
import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  lastUpdated: Date;
  refreshing: boolean;
  onRefresh: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  lastUpdated,
  refreshing,
  onRefresh
}) => (
  <header className="bg-white shadow-lg border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auto Infrastructure Dashboard</h1>
            <p className="text-sm text-gray-600">Real-time monitoring & CI/CD insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="text-sm font-medium text-gray-700">
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);