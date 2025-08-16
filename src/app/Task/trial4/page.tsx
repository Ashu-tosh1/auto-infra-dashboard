"use client";
import React, { JSX, useState } from "react";
import {
  Activity,
  Server,
  GitBranch,
  Container,
  CheckCircle,
  AlertTriangle,
  XCircle,
  // RefreshCw,
  Eye,
  Clock,
} from "lucide-react";

interface Build {
  number: number;
  status: string;
  duration: string;
  timestamp: string;
}

interface LastBuild extends Build {
  commitHash: string;
  branch: string;
}

interface DockerContainer {
  name: string;
  status: string;
  image: string;
  ports: string;
}

interface Alert {
  type: string;
  message: string;
  timestamp: string;
}

interface DashboardData {
  jenkins: {
    lastBuild: LastBuild;
    builds: Build[];
  };
  docker: {
    containers: DockerContainer[];
    stats: {
      totalContainers: number;
      runningContainers: number;
      stoppedContainers: number;
    };
  };
  ec2: {
    instanceId: string;
    instanceType: string;
    region: string;
    status: string;
    publicIp: string;
    privateIp: string;
  };
  alerts: Alert[];
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  // const [refreshing, setRefreshing] = useState<boolean>(false);
  // const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data
  const dashboardData: DashboardData = {
    jenkins: {
      lastBuild: {
        number: 45,
        status: "SUCCESS",
        timestamp: "2025-05-24T10:30:00Z",
        duration: "2m 34s",
        commitHash: "a7b3c2d",
        branch: "main",
      },
      builds: [
        { number: 45, status: "SUCCESS", duration: "2m 34s", timestamp: "10:30" },
        { number: 44, status: "SUCCESS", duration: "2m 12s", timestamp: "09:15" },
        { number: 43, status: "FAILURE", duration: "1m 45s", timestamp: "08:45" },
        { number: 42, status: "SUCCESS", duration: "2m 28s", timestamp: "08:20" },
      ],
    },
    docker: {
      containers: [
        {
          name: "auto-infra-container",
          status: "running",
          image: "ashutosh1201/auto-infra-dashboard:10",
          ports: "3002:3000",
        },
        {
          name: "prometheus",
          status: "running",
          image: "prom/prometheus",
          ports: "9090:9090",
        },
        {
          name: "grafana",
          status: "running",
          image: "grafana/grafana",
          ports: "3010:3000",
        },
        {
          name: "cadvisor",
          status: "running",
          image: "gcr.io/cadvisor/cadvisor:v0.47.2",
          ports: "8081:8080",
        },
      ],
      stats: {
        totalContainers: 4,
        runningContainers: 4,
        stoppedContainers: 0,
      },
    },
    ec2: {
      instanceId: "i-09712f7c751726df5",
      instanceType: "t2.micro",
      region: "ap-south-1a",
      status: "running",
      publicIp: "52.66.208.140",
      privateIp: "172.31.46.234",
    },
    alerts: [
      {
        type: "warning",
        message: "High memory usage detected (>80%)",
        timestamp: "10:45 AM",
      },
      {
        type: "info",
        message: "New deployment completed successfully",
        timestamp: "10:30 AM",
      },
    ],
  };

  // const handleRefresh = async (): Promise<void> => {
  //   setRefreshing(true);
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  //   setLastUpdated(new Date());
  //   setRefreshing(false);
  // };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "success":
      case "running":
        return "text-green-500";
      case "failure":
      case "failed":
        return "text-red-500";
      case "building":
      case "pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status.toLowerCase()) {
      case "success":
      case "running":
        return <CheckCircle className="w-4 h-4" />;
      case "failure":
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "building":
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // interface StatCardProps {
  //   title: string;
  //   value: string;
  //   icon: React.ComponentType<{ className?: string }>;
  //   color?: "green" | "blue" | "purple" | "orange";
  // }

  // const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color = "blue" }) => (
  //   <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
  //     <div className="flex items-center justify-between">
  //       <div>
  //         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
  //         <p
  //           className={`text-2xl font-bold ${
  //             color === "green"
  //               ? "text-green-600"
  //               : color === "blue"
  //               ? "text-blue-600"
  //               : color === "purple"
  //               ? "text-purple-600"
  //               : "text-orange-600"
  //           }`}
  //         >
  //           {value}
  //         </p>
  //       </div>
  //       <div
  //         className={`p-3 rounded-full ${
  //           color === "green"
  //             ? "bg-green-100"
  //             : color === "blue"
  //             ? "bg-blue-100"
  //             : color === "purple"
  //             ? "bg-purple-100"
  //             : "bg-orange-100"
  //         }`}
  //       >
  //         <Icon
  //           className={`w-6 h-6 ${
  //             color === "green"
  //               ? "text-green-600"
  //               : color === "blue"
  //               ? "text-blue-600"
  //               : color === "purple"
  //               ? "text-purple-600"
  //               : "text-orange-600"
  //           }`}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  // Overview Component
  // const Overview: React.FC = () => (
  //   <div className="space-y-8">
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       <StatCard
  //         title="Jenkins Build Status"
  //         value={dashboardData.jenkins.lastBuild.status}
  //         icon={GitBranch}
  //         color="green"
  //       />
  //       <StatCard
  //         title="Running Containers"
  //         value={`${dashboardData.docker.stats.runningContainers}/${dashboardData.docker.stats.totalContainers}`}
  //         icon={Container}
  //         color="blue"
  //       />
  //       <StatCard
  //         title="EC2 Instance"
  //         value={dashboardData.ec2.status.toUpperCase()}
  //         icon={Server}
  //         color="purple"
  //       />
  //     </div>

  //     <div className="bg-white rounded-xl p-6 shadow-lg">
  //       <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
  //         <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
  //         Recent Alerts
  //       </h3>
  //       <div className="space-y-3">
  //         {dashboardData.alerts.map((alert, index) => (
  //           <div
  //             key={index}
  //             className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
  //           >
  //             <div
  //               className={`p-1 rounded-full ${
  //                 alert.type === "warning" ? "bg-yellow-100" : "bg-blue-100"
  //               }`}
  //             >
  //               {alert.type === "warning" ? (
  //                 <AlertTriangle className="w-4 h-4 text-yellow-600" />
  //               ) : (
  //                 <CheckCircle className="w-4 h-4 text-blue-600" />
  //               )}
  //             </div>
  //             <div className="flex-1">
  //               <p className="text-sm text-gray-900">{alert.message}</p>
  //               <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );

  // Jenkins Component
  const Jenkins: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <GitBranch className="w-5 h-5 mr-2 text-blue-600" />
          Latest Build Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className={getStatusColor(dashboardData.jenkins.lastBuild.status)}>
                {getStatusIcon(dashboardData.jenkins.lastBuild.status)}
              </span>
              <span className="font-medium">Build #{dashboardData.jenkins.lastBuild.number}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Status:{" "}
                <span className={`font-medium ${getStatusColor(dashboardData.jenkins.lastBuild.status)}`}>
                  {dashboardData.jenkins.lastBuild.status}
                </span>
              </p>
              <p>Duration: {dashboardData.jenkins.lastBuild.duration}</p>
              <p>Branch: {dashboardData.jenkins.lastBuild.branch}</p>
              <p>Commit: {dashboardData.jenkins.lastBuild.commitHash}</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="font-medium text-gray-900 mb-3">Build History</h4>
            <div className="space-y-2">
              {dashboardData.jenkins.builds.map((build, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className={getStatusColor(build.status)}>
                      {getStatusIcon(build.status)}
                    </span>
                    <span className="font-medium">Build #{build.number}</span>
                    <span className="text-sm text-gray-500">{build.timestamp}</span>
                  </div>
                  <span className="text-sm text-gray-600">{build.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Stages</h3>
        <div className="flex items-center space-x-4 overflow-x-auto pb-4">
          {["Clone", "Build Docker Image", "Push to Docker Hub", "Deploy Container"].map(
            (stage, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center space-y-2 min-w-max">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {stage}
                  </span>
                </div>
                {index < 3 && <div className="w-8 h-0.5 bg-green-300 mx-2"></div>}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  // Docker Component
  const Docker: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Container className="w-5 h-5 mr-2 text-blue-600" />
          Container Status
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Container</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Image</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ports</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.docker.containers.map((container, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{container.name}</td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center space-x-1 ${getStatusColor(container.status)}`}>
                      {getStatusIcon(container.status)}
                      <span className="capitalize">{container.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{container.image}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{container.ports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Monitoring Component
  const Monitoring: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-purple-600" />
          EC2 Instance Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Instance ID</p>
            <p className="text-lg font-mono text-gray-900">{dashboardData.ec2.instanceId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Instance Type</p>
            <p className="text-lg font-semibold text-gray-900">{dashboardData.ec2.instanceType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Region</p>
            <p className="text-lg font-semibold text-gray-900">{dashboardData.ec2.region}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Public IP</p>
            <p className="text-lg font-mono text-gray-900">{dashboardData.ec2.publicIp}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Private IP</p>
            <p className="text-lg font-mono text-gray-900">{dashboardData.ec2.privateIp}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-orange-600" />
          Monitoring Services
        </h3>
        <div className="space-y-4">
          {[
            { name: "Grafana", port: "3010", status: "running", url: "http://localhost:3010" },
            { name: "Prometheus", port: "9090", status: "running", url: "http://localhost:9090" },
            { name: "cAdvisor", port: "8081", status: "running", url: "http://localhost:8081" },
            { name: "Graphite", port: "80", status: "running", url: "http://localhost:80" },
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(service.status)}>
                  {getStatusIcon(service.status)}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">Port: {service.port}</p>
                </div>
              </div>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case "overview":
        // return <Overview />;
      case "jenkins":
        return <Jenkins />;
      case "docker":
        return <Docker />;
      case "monitoring":
        return <Monitoring />;
      default:
      // return <Overview />;
             return <Monitoring />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      {/* <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Auto Infrastructure Dashboard
                </h1>
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
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "jenkins", label: "Jenkins CI/CD", icon: GitBranch },
              { id: "docker", label: "Docker Containers", icon: Container },
              { id: "monitoring", label: "System Monitoring", icon: Server },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Server className="w-4 h-4" />
              <span className="text-sm">Infrastructure Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Real-time Monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">CI/CD Pipeline</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;