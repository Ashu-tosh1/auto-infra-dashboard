"use client"
import React, { useState } from 'react';
import { Plus,  CheckCircle, Circle, Trash2 } from 'lucide-react';
import Navigation from '@/components/DashboardNavigation';
import Header from '@/components/Header';
import ScheduleTab from '@/components/ScheduleTab';
// import ScheduleItemComponent from '@/components/ScheduleItem';

// Types
interface ScheduleItem {
  id: number;
  time: string;
  duration: number;
  task: string;
  category: CategoryKey;
  completed: boolean;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Goal {
  id: number;
  text: string;
  category: CategoryKey;
}

type CategoryKey = 'work' | 'personal' | 'health' | 'learning';
type QuadrantKey = 'urgent_important' | 'not_urgent_important' | 'urgent_not_important' | 'not_urgent_not_important';
type GoalColumnKey = 'backlog' | 'today' | 'in_progress' | 'completed';
type TabKey = 'schedule' | 'priority' | 'goals';

interface Category {
  color: string;
  label: string;
}

interface Quadrant {
  title: string;
  color: string;
}

// Constants
const categories: Record<CategoryKey, Category> = {
  work: { color: 'bg-blue-500', label: 'Work' },
  personal: { color: 'bg-green-500', label: 'Personal' },
  health: { color: 'bg-red-500', label: 'Health' },
  learning: { color: 'bg-purple-500', label: 'Learning' }
};

const quadrants: Record<QuadrantKey, Quadrant> = {
  urgent_important: { title: 'Urgent & Important', color: 'border-red-300 bg-red-50' },
  not_urgent_important: { title: 'Important, Not Urgent', color: 'border-yellow-300 bg-yellow-50' },
  urgent_not_important: { title: 'Urgent, Not Important', color: 'border-orange-300 bg-orange-50' },
  not_urgent_not_important: { title: 'Neither Urgent nor Important', color: 'border-gray-300 bg-gray-50' }
};

// Header Component


// Navigation Component
{/* <Navigation activeTab={activeTab} onTabChange={setActiveTab} /> */}

// Schedule Item Component


// Schedule Tab Component

// Task Component
interface TaskComponentProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, onToggleComplete, onDelete }) => (
  <div className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
    <button
      onClick={onToggleComplete}
      className="text-gray-400 hover:text-indigo-600 transition-colors"
    >
      {task.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
    </button>
    <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
      {task.text}
    </span>
    <button
      onClick={onDelete}
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

// Priority Matrix Tab Component
interface PriorityTabProps {
  tasks: Record<QuadrantKey, Task[]>;
  onAddTask: (quadrant: QuadrantKey, text: string) => void;
  onToggleTask: (quadrant: QuadrantKey, id: number) => void;
  onDeleteTask: (quadrant: QuadrantKey, id: number) => void;
}

const PriorityTab: React.FC<PriorityTabProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantKey>('urgent_important');

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(selectedQuadrant, newTask);
      setNewTask('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Priority Matrix</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Add new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={selectedQuadrant}
            onChange={(e) => setSelectedQuadrant(e.target.value as QuadrantKey)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(quadrants).map(([key, quad]) => (
              <option key={key} value={key}>{quad.title}</option>
            ))}
          </select>
          <button
            onClick={handleAddTask}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(quadrants).map(([quadrantKey, quadrant]) => (
          <div key={quadrantKey} className={`border-2 rounded-lg p-4 ${quadrant.color}`}>
            <h3 className="font-bold text-gray-800 mb-4">{quadrant.title}</h3>
            <div className="space-y-2">
              {tasks[quadrantKey as QuadrantKey].map(task => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onToggleComplete={() => onToggleTask(quadrantKey as QuadrantKey, task.id)}
                  onDelete={() => onDeleteTask(quadrantKey as QuadrantKey, task.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Goal Component
interface GoalComponentProps {
  goal: Goal;
  columnKey: GoalColumnKey;
  onMove: (goalId: number, fromColumn: GoalColumnKey, toColumn: GoalColumnKey) => void;
  onDelete: (columnKey: GoalColumnKey, id: number) => void;
}

const GoalComponent: React.FC<GoalComponentProps> = ({ goal, columnKey, onMove, onDelete }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-indigo-500">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-gray-800 font-medium text-sm">{goal.text}</p>
        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 text-white ${categories[goal.category].color}`}>
          {categories[goal.category].label}
        </span>
      </div>
      <button
        onClick={() => onDelete(columnKey, goal.id)}
        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
      >
        <Trash2 size={14} />
      </button>
    </div>
    <div className="flex space-x-1 mt-3">
      {columnKey !== 'backlog' && (
        <button
          onClick={() => onMove(goal.id, columnKey, 'backlog')}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
        >
          ← Backlog
        </button>
      )}
      {columnKey !== 'today' && columnKey !== 'completed' && (
        <button
          onClick={() => onMove(goal.id, columnKey, 'today')}
          className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded transition-colors"
        >
          → Today
        </button>
      )}
      {columnKey !== 'in_progress' && columnKey !== 'completed' && (
        <button
          onClick={() => onMove(goal.id, columnKey, 'in_progress')}
          className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded transition-colors"
        >
          → Progress
        </button>
      )}
      {columnKey !== 'completed' && (
        <button
          onClick={() => onMove(goal.id, columnKey, 'completed')}
          className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded transition-colors"
        >
          ✓ Done
        </button>
      )}
    </div>
  </div>
);

// Goals Tab Component
interface GoalsTabProps {
  goals: Record<GoalColumnKey, Goal[]>;
  onAddGoal: (text: string, category: CategoryKey) => void;
  onMoveGoal: (goalId: number, fromColumn: GoalColumnKey, toColumn: GoalColumnKey) => void;
  onDeleteGoal: (column: GoalColumnKey, id: number) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ goals, onAddGoal, onMoveGoal, onDeleteGoal }) => {
  const [newGoal, setNewGoal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('work');

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      onAddGoal(newGoal, selectedCategory);
      setNewGoal('');
    }
  };

  const columns = [
    { key: 'backlog' as GoalColumnKey, title: 'Backlog', color: 'bg-gray-100' },
    { key: 'today' as GoalColumnKey, title: 'Today', color: 'bg-blue-100' },
    { key: 'in_progress' as GoalColumnKey, title: 'In Progress', color: 'bg-yellow-100' },
    { key: 'completed' as GoalColumnKey, title: 'Completed', color: 'bg-green-100' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Goal Board</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Add new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={handleAddGoal}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map(column => (
          <div key={column.key} className={`${column.color} rounded-lg p-4`}>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              {column.title}
              <span className="text-sm bg-white px-2 py-1 rounded-full">
                {goals[column.key].length}
              </span>
            </h3>
            <div className="space-y-3">
              {goals[column.key].map(goal => (
                <GoalComponent
                  key={goal.id}
                  goal={goal}
                  columnKey={column.key}
                  onMove={onMoveGoal}
                  onDelete={onDeleteGoal}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
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