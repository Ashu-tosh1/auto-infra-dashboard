import { Clock, Target, TrendingUp } from "lucide-react";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}
type TabKey = 'schedule' | 'priority' | 'goals';

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
   
  const tabs = [
    { id: 'schedule' as TabKey, label: 'Daily Schedule', icon: Clock },
    { id: 'priority' as TabKey, label: 'Priority Matrix', icon: Target },
    { id: 'goals' as TabKey, label: 'Goal Board', icon: TrendingUp }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;