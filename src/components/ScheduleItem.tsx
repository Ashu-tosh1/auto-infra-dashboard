import { Category, CategoryKey, ScheduleItemProps } from "@/libs/Mockdata";
import { CheckCircle, Circle, Trash2 } from "lucide-react";



const categories: Record<CategoryKey, Category> = {
  work: { color: 'bg-blue-500', label: 'Work' },
  personal: { color: 'bg-green-500', label: 'Personal' },
  health: { color: 'bg-red-500', label: 'Health' },
  learning: { color: 'bg-purple-500', label: 'Learning' }
};



const ScheduleItemComponent: React.FC<ScheduleItemProps> = ({ item, onToggleComplete, onDelete }) => (
  <div className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 ${categories[item.category].color} ${
    item.completed ? 'bg-gray-50 opacity-75' : 'bg-white border border-gray-200'
  }`}>
    <button
      onClick={() => onToggleComplete(item.id)}
      className="text-gray-400 hover:text-indigo-600 transition-colors"
    >
      {item.completed ? <CheckCircle size={20} className="text-green-500" /> : <Circle size={20} />}
    </button>
    <div className="text-sm font-medium text-gray-500 w-16">
      {item.time}
    </div>
    <div className="flex-1">
      <div className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
        {item.task}
      </div>
      <div className="text-sm text-gray-500">
        {item.duration} minutes • {categories[item.category].label}
      </div>
    </div>
    <button
      onClick={() => onDelete(item.id)}
      className="text-gray-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

export default ScheduleItemComponent