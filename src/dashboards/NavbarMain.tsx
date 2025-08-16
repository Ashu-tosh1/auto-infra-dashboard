"use client";
import {
  Activity,
  Container,
  GitBranch,
  RefreshCw,
  Server,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface NavbarMainProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavbarMain: React.FC<NavbarMainProps> = ({ activeTab, setActiveTab }) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  return (
    <div>
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Link href="/">
                  <Activity className="w-8 h-8 text-white" />
                </Link>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Auto Infrastructure Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Real-time monitoring & CI/CD insights
                </p>
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
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-around">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "jenkins", label: "Jenkins CI/CD", icon: GitBranch },
              { id: "docker", label: "Docker Containers", icon: Container },
              { id: "monitoring", label: "System Monitoring", icon: Server },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-space-between py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarMain;
