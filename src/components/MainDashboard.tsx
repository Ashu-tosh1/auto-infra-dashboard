"use client"
import GoalsTab from "./GoalTab";
import { useState } from "react";
import Header from "./Header";
import ScheduleTab from "./ScheduleTab";
import PriorityTab from "./PriorityTab";
import Navigation from "./DashboardNavigation";
import { CategoryKey, Goal, GoalColumnKey, QuadrantKey, ScheduleItem, TabKey, Task } from "@/libs/Mockdata";

const DayPlanningDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('schedule');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Schedule State
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([   
      { id: 1, time: '09:00', duration: 60, task: 'Morning Planning', category: 'work', completed: false },
      { id: 2, time: '10:00', duration: 90, task: 'Project Development', category: 'work', completed: false },
      { id: 3, time: '14:00', duration: 30, task: 'Lunch Break', category: 'personal', completed: false },
    ]);
    
    // Tasks State
    const [tasks, setTasks] = useState<Record<QuadrantKey, Task[]>>({
      urgent_important: [
        { id: 1, text: 'Complete project proposal', completed: false },
        { id: 2, text: 'Review client feedback', completed: false }
      ],
      not_urgent_important: [
        { id: 3, text: 'Learn new technology', completed: false },
        { id: 4, text: 'Plan next week', completed: false }
      ],
      urgent_not_important: [
        { id: 5, text: 'Reply to emails', completed: false },
        { id: 6, text: 'Schedule meetings', completed: false }
      ],
      not_urgent_not_important: [
        { id: 7, text: 'Organize desktop', completed: false }
      ]
    });
    
    // Goals State
    const [goals, setGoals] = useState<Record<GoalColumnKey, Goal[]>>({
      backlog: [
        { id: 1, text: 'Build personal website', category: 'personal' },
        { id: 2, text: 'Learn TypeScript advanced concepts', category: 'learning' }
      ],
      today: [
        { id: 3, text: 'Complete dashboard mockup', category: 'work' },
        { id: 4, text: 'Exercise for 30 minutes', category: 'health' }
      ],
      in_progress: [
        { id: 5, text: 'Reading "Clean Code" book', category: 'learning' }
      ],
      completed: [
        { id: 6, text: 'Set up development environment', category: 'work' }
      ]
    });
  
    // Schedule functions
    const addScheduleItem = (item: Omit<ScheduleItem, 'id' | 'completed'>) => {
      setScheduleItems([...scheduleItems, {
        id: Date.now(),
        ...item,
        completed: false
      }]);
    };
  
    const toggleScheduleComplete = (id: number) => {
      setScheduleItems(scheduleItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      ));
    };
  
    const deleteScheduleItem = (id: number) => {
      setScheduleItems(scheduleItems.filter(item => item.id !== id));
    };
  
    // Task functions
    const addTask = (quadrant: QuadrantKey, text: string) => {
      setTasks({
        ...tasks,
        [quadrant]: [...tasks[quadrant], {
          id: Date.now(),
          text,
          completed: false
        }]
      });
    };
  
    const toggleTaskComplete = (quadrant: QuadrantKey, id: number) => {
      setTasks({
        ...tasks,
        [quadrant]: tasks[quadrant].map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      });
    };
  
    const deleteTask = (quadrant: QuadrantKey, id: number) => {
      setTasks({
        ...tasks,
        [quadrant]: tasks[quadrant].filter(task => task.id !== id)
      });
    };
  
    // Goal functions
    const addGoal = (text: string, category: CategoryKey) => {
      setGoals({
        ...goals,
        backlog: [...goals.backlog, {
          id: Date.now(),
          text,
          category
        }]
      });
    };
  
    const moveGoal = (goalId: number, fromColumn: GoalColumnKey, toColumn: GoalColumnKey) => {
      const goal = goals[fromColumn].find(g => g.id === goalId);
      if (goal) {
        setGoals({
          ...goals,
          [fromColumn]: goals[fromColumn].filter(g => g.id !== goalId),
          [toColumn]: [...goals[toColumn], goal]
        });
      }
    };
  
    const deleteGoal = (column: GoalColumnKey, id: number) => {
      setGoals({
        ...goals,
        [column]: goals[column].filter(goal => goal.id !== id)
      });
    };
  
    // Calculate stats
    const completedScheduleItems = scheduleItems.filter(item => item.completed).length;
    const totalScheduleItems = scheduleItems.length;
    const completionRate = totalScheduleItems > 0 ? Math.round((completedScheduleItems / totalScheduleItems) * 100) : 0;
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Header
            completionRate={completionRate}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
          
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
  
          {activeTab === 'schedule' && (
            <ScheduleTab
              scheduleItems={scheduleItems}
              currentDate={currentDate}
              onAddItem={addScheduleItem}
              onToggleComplete={toggleScheduleComplete}
              onDeleteItem={deleteScheduleItem}
            />
          )}
  
          {activeTab === 'priority' && (
            <PriorityTab
              tasks={tasks}
              onAddTask={addTask}
              onToggleTask={toggleTaskComplete}
              onDeleteTask={deleteTask}
            />
          )}
  
          {activeTab === 'goals' && (
            <GoalsTab
              goals={goals}
              onAddGoal={addGoal}
              onMoveGoal={moveGoal}
              onDeleteGoal={deleteGoal}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default DayPlanningDashboard;