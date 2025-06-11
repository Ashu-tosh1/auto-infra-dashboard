import { Quadrant, QuadrantKey, Task, TaskComponentProps } from "@/libs/Mockdata";
import { Circle } from "lucide-react";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const quadrants: Record<QuadrantKey, Quadrant> = {
    urgent_important: { title: 'Urgent & Important', color: 'border-red-300 bg-red-50' },
    not_urgent_important: { title: 'Important, Not Urgent', color: 'border-yellow-300 bg-yellow-50' },
    urgent_not_important: { title: 'Urgent, Not Important', color: 'border-orange-300 bg-orange-50' },
    not_urgent_not_important: { title: 'Neither Urgent nor Important', color: 'border-gray-300 bg-gray-50' }
  };
    
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
  
export default PriorityTab