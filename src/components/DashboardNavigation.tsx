import React from 'react';
import { Activity, GitBranch, Container, Server, TrendingUp } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface DashboardNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'jenkins', label: 'Jenkins CI/CD', icon: GitBranch },
  { id: 'docker', label: 'Docker Containers', icon: Container },
  { id: 'monitoring', label: 'System Monitoring', icon: Server },
  { id: 'metrics', label: 'Performance Metrics', icon: TrendingUp }
];

export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activeTab,
  onTabChange
}) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  </nav>
);