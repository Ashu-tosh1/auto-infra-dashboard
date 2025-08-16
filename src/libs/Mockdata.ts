export type CategoryKey = 'work' | 'personal' | 'health' | 'learning';
export type QuadrantKey = 'urgent_important' | 'not_urgent_important' | 'urgent_not_important' | 'not_urgent_not_important';
export type GoalColumnKey = 'backlog' | 'today' | 'in_progress' | 'completed';
export type TabKey = 'schedule' | 'priority' | 'goals';


export interface ScheduleItem {
    id: number;
    time: string;
    duration: number;
    task: string;
    category: CategoryKey;
    completed: boolean;
  }
  
 export interface Task {
    id: number;
    text: string;
    completed: boolean;
  }
  
export  interface Goal {
    id: number;
    text: string;
    category: CategoryKey;
}
  
export interface Category {
    color: string;
    label: string;
  }

  
 export interface ScheduleItemProps {
    item: ScheduleItem;
    onToggleComplete: (id: number) => void;
    onDelete: (id: number) => void;
}
  
export interface Quadrant {
        title: string;
        color: string;
}
      


export interface TaskComponentProps {
    task: Task;
    onToggleComplete: () => void;
    onDelete: () => void;
}
  
export interface ScheduleTabProps {
  scheduleItems: ScheduleItem[];
  currentDate: string;
  onAddItem: (item: Omit<ScheduleItem, 'id' | 'completed'>) => void;
  onToggleComplete: (id: number) => void;
  onDeleteItem: (id: number) => void;
}


export const scheduleItems: ScheduleItem[] = [
    { id: 1, time: '09:00', duration: 60, task: 'Work on project', category: 'work', completed: false },
    { id: 2, time: '10:00', duration: 30, task: 'Gym', category: 'health', completed: false },
    { id: 3, time: '11:00', duration: 45, task: 'Read book', category: 'learning', completed: false },
    { id: 4, time: '12:00', duration: 60, task: 'Lunch with friends', category: 'personal', completed: false },
    { id: 5, time: '13:00', duration: 30, task: 'Call mom', category: 'personal', completed: false },
    { id: 6, time: '14:00', duration: 45, task: 'Study for exam', category: 'learning', completed: false },
];



export const categories: Record<CategoryKey, Category> = {
      work: { color: 'bg-blue-500', label: 'Work' },
      personal: { color: 'bg-green-500', label: 'Personal' },
      health: { color: 'bg-red-500', label: 'Health' },
      learning: { color: 'bg-purple-500', label: 'Learning' }
};
    


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

export  interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: "green" | "blue" | "purple" | "orange";
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

export const dashboardData: DashboardData = {
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