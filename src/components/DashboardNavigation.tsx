import { TabKey } from "@/libs/Mockdata";
import { Clock, Target, TrendingUp } from "lucide-react";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "schedule" as TabKey, label: "Daily Schedule", icon: Clock },
    { id: "priority" as TabKey, label: "Priority Matrix", icon: Target },
    { id: "goals" as TabKey, label: "Goal Board", icon: TrendingUp },
  ];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-indigo-100/40 to-purple-100/40 backdrop-blur-lg shadow-xl p-4 border border-white/20 mb-6">
      <div className="flex justify-center gap-4 sm:gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 text-sm font-semibold
                ${isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "bg-indigo-200/30 text-gray-800 hover:bg-indigo-300/40 hover:text-indigo-700"
                }`}
            >
              <Icon
                size={18}
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
