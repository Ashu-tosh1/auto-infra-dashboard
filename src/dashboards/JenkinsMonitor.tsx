/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, GitBranch, Hash, Timer, Calendar } from 'lucide-react';

// Define TypeScript interfaces for type safety
interface Build {
  number: number;
  result: string | null;
  timestamp: number;
  duration: number;
  description: string | null;
}

interface JenkinsResponse {
  builds: Build[];
}

const JenkinsDashboard: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jenkins-builds');
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data: JenkinsResponse = await response.json();
        setBuilds(data.builds);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch build data');
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBuilds, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failure':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string | null): string => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failure':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <XCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Build Data</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const latestBuild = builds[0];
  const recentBuilds = builds.slice(0, 5);

  return ( 
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Latest Build Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <GitBranch className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Latest Build Information</h2>
                </div>
              </div>
              
              {latestBuild && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(latestBuild.result)}
                      <span className="ml-2 text-xl font-bold text-gray-900">
                        Build #{latestBuild.number}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(latestBuild.result)}`}>
                      {latestBuild.result?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Timer className="w-4 h-4 mr-2" />
                      <span className="font-medium">Duration:</span>
                      <span className="ml-1">{formatDuration(latestBuild.duration)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <GitBranch className="w-4 h-4 mr-2" />
                      <span className="font-medium">Branch:</span>
                      <span className="ml-1">main</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Hash className="w-4 h-4 mr-2" />
                      <span className="font-medium">Commit:</span>
                      <span className="ml-1 font-mono">a7b3c2d</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Build History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Build History</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {recentBuilds.map((build) => (
                  <div key={build.number} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(build.result)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">
                              Build #{build.number}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatTime(build.timestamp)}
                            </span>
                          </div>
                          {build.description && (
                            <p className="text-sm text-gray-600 mt-1">{build.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {formatDuration(build.duration)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(build.result)}`}>
                          {build.result?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline Stages</h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              {['Clone', 'Build Docker Image', 'Push to Docker Hub', 'Deploy Container'].map((stage, index) => (
                <div key={stage} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center max-w-20">
                      {stage}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="w-16 h-0.5 bg-green-200 mx-4 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Builds Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Builds</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Build
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {builds.map((build) => (
                  <tr key={build.number} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(build.result)}
                        <span className="ml-2 font-medium text-gray-900">#{build.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(build.result)}`}>
                        {build.result?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(build.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Timer className="w-4 h-4 mr-1" />
                        {formatDuration(build.duration)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {build.description || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JenkinsDashboard;