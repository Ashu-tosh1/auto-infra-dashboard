/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { 
  Play, 
  Square, 
  Pause, 
  RotateCcw, 
  Activity, 
 
  Cpu, 
  Network,
  Clock,
  Package,
  Box,
  Eye
} from 'lucide-react';

interface ContainerStats {
  cpu: string;
  memory: string;
  memoryPercent: string;
  network: string;
  disk: string;
}

interface Port {
  host: string;
  container: string;
  type: string;
}

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused' | 'restarting';
  ports: Port[];
  uptime: string;
  size: string;
  createdAt: string;
  isRunning: boolean;
  stats?: ContainerStats | null;
}

interface DockerResponse {
  containers: DockerContainer[];
}

const DockerContainersMonitor: React.FC = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [containerLogs, setContainerLogs] = useState<string>('');

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/docker-containers');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch containers: ${response.status}`);
      }
      
      const data: DockerResponse = await response.json();
      setContainers(data.containers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch container data');
    } finally {
      setLoading(false);
    }
  };

  const fetchContainerLogs = async (containerId: string) => {
    try {
      const response = await fetch('/api/docker-containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ containerId, lines: 50 })
      });
      
      if (response.ok) {
        const data = await response.json();
        setContainerLogs(data.logs);
        setSelectedContainer(containerId);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const getStatusIcon = (status: string, isRunning: boolean) => {
    if (isRunning) {
      return <Play className="w-4 h-4 text-green-500 fill-current" />;
    }
    
    switch (status) {
      case 'stopped':
        return <Square className="w-4 h-4 text-red-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'restarting':
        return <RotateCcw className="w-4 h-4 text-blue-500" />;
      default:
        return <Square className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, isRunning: boolean) => {
    if (isRunning) return 'text-green-600 bg-green-50 border-green-200';
    
    switch (status) {
      case 'stopped':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'restarting':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatPorts = (ports: Port[]) => {
    if (ports.length === 0) return 'No ports exposed';
    
    return ports.map(port => {
      if (port.host) {
        return `${port.host} → ${port.container}/${port.type}`;
      }
      return `${port.container}/${port.type}`;
    }).join(', ');
  };

  if (loading && containers.length === 0) {
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
              <Square className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Container Data</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <p className="text-sm text-red-500 mt-2">
                  Make sure Docker is running and accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const runningContainers = containers.filter(c => c.isRunning).length;
  const totalContainers = containers.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Docker Containers</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              <Clock className="w-4 h-4 inline mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {runningContainers} of {totalContainers} running
            </div>
          </div>
        </div>

        {/* Container Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Box className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Container Status</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Container
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resources
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {containers.map((container) => (
                  <tr key={container.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(container.status, container.isRunning)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {container.name}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {container.id.substring(0, 12)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(container.status, container.isRunning)}`}>
                        {container.isRunning ? 'Running' : container.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-xs" title={container.image}>
                          {container.image}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="max-w-xs truncate" title={formatPorts(container.ports)}>
                        {formatPorts(container.ports)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {container.uptime}
                    </td>
                    <td className="px-6 py-4">
                      {container.stats ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Cpu className="w-3 h-3 mr-1" />
                            <span>CPU: {container.stats.cpu}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Activity className="w-3 h-3 mr-1" />
                            <span>Mem: {container.stats.memoryPercent}</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Network className="w-3 h-3 mr-1" />
                            <span>Net: {container.stats.network}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No stats</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => fetchContainerLogs(container.id)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Logs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Container Logs Modal */}
        {selectedContainer && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Container Logs - {containers.find(c => c.id === selectedContainer)?.name}
              </h3>
              <button
                onClick={() => setSelectedContainer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto font-mono">
                {containerLogs || 'No logs available'}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DockerContainersMonitor;