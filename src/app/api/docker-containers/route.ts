// src/app/api/docker-containers/route.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Get container information using docker command
    const { stdout } = await execAsync(
      'docker ps --format "{{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.RunningFor}}\t{{.Size}}\t{{.CreatedAt}}"'
    );

    if (!stdout.trim()) {
      return Response.json({ containers: [] }, { status: 200 });
    }

    const containers = stdout.trim().split('\n').map(line => {
      const [id, name, image, status, ports, size, createdAt] = line.split('\t');
      
      return {
        id: id,
        name: name,
        image: image,
        status: parseStatus(status),
        ports: parsePorts(ports),
        
        size: size || 'N/A',
        createdAt: createdAt,
        isRunning: status.toLowerCase().includes('up')
      };
    });

    // Get additional stats for running containers
    const containersWithStats = await Promise.all(
      containers.map(async (container) => {
        if (container.isRunning) {
          try {
            const stats = await getContainerStats(container.id);
            return { ...container, stats };
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return { ...container, stats: null };
          }
        }
        return container;
      })
    );

    return Response.json({ containers: containersWithStats }, { status: 200 });

  } catch (error) {
    console.error('Docker API Error:', error);
    return Response.json(
      { 
        error: 'Failed to fetch container information',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

// Helper function to parse container status
function parseStatus(status: string): 'running' | 'stopped' | 'paused' | 'restarting' {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('up')) return 'running';
  if (lowerStatus.includes('paused')) return 'paused';
  if (lowerStatus.includes('restarting')) return 'restarting';
  return 'stopped';
}

// Helper function to parse ports
function parsePorts(ports: string): Array<{host: string, container: string, type: string}> {
  if (!ports || ports === '') return [];
  
  const portMappings = ports.split(',').map(port => {
    const match = port.trim().match(/(\d+\.\d+\.\d+\.\d+):(\d+)->(\d+)\/(tcp|udp)/);
    if (match) {
      return {
        host: `${match[1]}:${match[2]}`,
        container: match[3],
        type: match[4]
      };
    }
    
    // Handle simple port format like "3002/tcp"
    const simpleMatch = port.trim().match(/(\d+)\/(tcp|udp)/);
    if (simpleMatch) {
      return {
        host: '',
        container: simpleMatch[1],
        type: simpleMatch[2]
      };
    }
    
    return null;
  }).filter(
    (mapping): mapping is { host: string; container: string; type: string } => mapping !== null
  );
  
  return portMappings;
}

// Helper function to get container stats
async function getContainerStats(containerId: string) {
  try {
    const { stdout } = await execAsync(
      `docker stats ${containerId} --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"`
    );
    
    const [cpuPerc, memUsage, memPerc, netIO, blockIO] = stdout.trim().split('\t');
    
    return {
      cpu: cpuPerc,
      memory: memUsage,
      memoryPercent: memPerc,
      network: netIO,
      disk: blockIO
    };
  } catch (error) {
    console.error('Failed to get container stats:', error);
    return null;
  }
}

// Additional endpoint to get container logs
export async function POST(request: Request) {
  try {
    const { containerId, lines = 100 } = await request.json();
    
    if (!containerId) {
      return Response.json(
        { error: 'Container ID is required' },
        { status: 400 }
      );
    }

    const { stdout } = await execAsync(
      `docker logs --tail ${lines} ${containerId}`
    );

    return Response.json({ logs: stdout }, { status: 200 });

  } catch (error) {
    console.error('Failed to get container logs:', error);
    return Response.json(
      { error: 'Failed to fetch container logs' },
      { status: 500 }
    );
  }
}