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