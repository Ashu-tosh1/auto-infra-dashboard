import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import ScheduleItemComponent from "./ScheduleItem";
import { Category, CategoryKey, ScheduleTabProps } from "@/libs/Mockdata";

const categories: Record<CategoryKey, Category> = {
  work: { color: 'bg-blue-500', label: 'Work' },
  personal: { color: 'bg-green-500', label: 'Personal' },
  health: { color: 'bg-red-500', label: 'Health' },
  learning: { color: 'bg-purple-500', label: 'Learning' }
};

const ScheduleTab: React.FC<ScheduleTabProps> = ({
  scheduleItems,
  currentDate,
  onAddItem,
  onToggleComplete,
  onDeleteItem
}) => {
  const [newItem, setNewItem] = useState({ time: '', task: '', duration: 60, category: 'work' as CategoryKey });

  const handleAddItem = () => {
    if (newItem.time && newItem.task) {
      onAddItem(newItem);
      setNewItem({ time: '', task: '', duration: 60, category: 'work' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Schedule</h2>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-500" />
          <span className="text-gray-600">
            {new Date(currentDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="time"
            value={newItem.time}
            onChange={(e) => setNewItem({...newItem, time: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Task description"
            value={newItem.task}
            onChange={(e) => setNewItem({...newItem, task: e.target.value})}
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value as CategoryKey})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={handleAddItem}
            className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {scheduleItems
          .sort((a, b) => a.time.localeCompare(b.time))
          .map(item => (
            <ScheduleItemComponent
              key={item.id}
              item={item}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteItem}
            />
          ))}
      </div>
    </div>
  );
};

export default ScheduleTab