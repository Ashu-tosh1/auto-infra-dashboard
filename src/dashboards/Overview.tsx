import { dashboardData, StatCardProps } from '@/libs/Mockdata';
import { AlertTriangle, CheckCircle, Container, GitBranch, Server } from 'lucide-react';
import React from 'react'

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p
            className={`text-2xl font-bold ${
              color === "green"
                ? "text-green-600"
                : color === "blue"
                ? "text-blue-600"
                : color === "purple"
                ? "text-purple-600"
                : "text-orange-600"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            color === "green"
              ? "bg-green-100"
              : color === "blue"
              ? "bg-blue-100"
              : color === "purple"
              ? "bg-purple-100"
              : "bg-orange-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === "green"
                ? "text-green-600"
                : color === "blue"
                ? "text-blue-600"
                : color === "purple"
                ? "text-purple-600"
                : "text-orange-600"
            }`}
          />
        </div>
      </div>
    </div>
  );    

  const Overview: React.FC = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Jenkins Build Status"
          value={dashboardData.jenkins.lastBuild.status}
          icon={GitBranch}
          color="green"
        />
        <StatCard
          title="Running Containers"
          value={`${dashboardData.docker.stats.runningContainers}/${dashboardData.docker.stats.totalContainers}`}
          icon={Container}
          color="blue"
        />
        <StatCard
          title="EC2 Instance"
          value={dashboardData.ec2.status.toUpperCase()}
          icon={Server}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          {dashboardData.alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className={`p-1 rounded-full ${
                  alert.type === "warning" ? "bg-yellow-100" : "bg-blue-100"
                }`}
              >
                {alert.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export default Overview