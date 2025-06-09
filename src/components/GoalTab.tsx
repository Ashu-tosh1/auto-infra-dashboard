import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Category {
    color: string;
    label: string;
  }
  
  interface Goal {
    id: number;
    text: string;
    category: CategoryKey;
  }
  
type CategoryKey = 'work' | 'personal' | 'health' | 'learning';
type GoalColumnKey = 'backlog' | 'today' | 'in_progress' | 'completed';
  
  // Constants
  const categories: Record<CategoryKey, Category> = {
    work: { color: 'bg-blue-500', label: 'Work' },
    personal: { color: 'bg-green-500', label: 'Personal' },
    health: { color: 'bg-red-500', label: 'Health' },
    learning: { color: 'bg-purple-500', label: 'Learning' }
  };

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
  
  export default GoalsTab