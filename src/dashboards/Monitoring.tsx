import { dashboardData } from '@/libs/Mockdata';
import { AlertTriangle, CheckCircle, Clock, Eye, Server, XCircle } from 'lucide-react';
import React, { JSX } from 'react'


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
        return <AlertTriangle    className="w-4 h-4" />;
    }
  };
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


export default Monitoring