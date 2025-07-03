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