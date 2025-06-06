import React, { useState, useEffect } from 'react';
import { Plus, Clock, Target, CheckCircle, Circle, Trash2, Edit3, Calendar, TrendingUp } from 'lucide-react';

const DayPlanningDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Schedule State
  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, time: '09:00', duration: 60, task: 'Morning Planning', category: 'work', completed: false },
    { id: 2, time: '10:00', duration: 90, task: 'Project Development', category: 'work', completed: false },
    { id: 3, time: '14:00', duration: 30, task: 'Lunch Break', category: 'personal', completed: false },
  ]);
  
  // Tasks State (Priority Matrix)
  const [tasks, setTasks] = useState({
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
  const [goals, setGoals] = useState({
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
  
  // New item states
  const [newScheduleItem, setNewScheduleItem] = useState({ time: '', task: '', duration: 60, category: 'work' });
  const [newTask, setNewTask] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState('urgent_important');
  const [selectedGoalCategory, setSelectedGoalCategory] = useState('work');

  const categories = {
    work: { color: 'bg-blue-500', label: 'Work' },
    personal: { color: 'bg-green-500', label: 'Personal' },
    health: { color: 'bg-red-500', label: 'Health' },
    learning: { color: 'bg-purple-500', label: 'Learning' }
  };

  const quadrants = {
    urgent_important: { title: 'Urgent & Important', color: 'border-red-300 bg-red-50' },
    not_urgent_important: { title: 'Important, Not Urgent', color: 'border-yellow-300 bg-yellow-50' },
    urgent_not_important: { title: 'Urgent, Not Important', color: 'border-orange-300 bg-orange-50' },
    not_urgent_not_important: { title: 'Neither Urgent nor Important', color: 'border-gray-300 bg-gray-50' }
  };

  // Schedule functions
  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.task) {
      setScheduleItems([...scheduleItems, {
        id: Date.now(),
        ...newScheduleItem,
        completed: false
      }]);
      setNewScheduleItem({ time: '', task: '', duration: 60, category: 'work' });
    }
  };

  const toggleScheduleComplete = (id) => {
    setScheduleItems(scheduleItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteScheduleItem = (id) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  // Task functions
  const addTask = () => {
    if (newTask.trim()) {
      setTasks({
        ...tasks,
        [selectedQuadrant]: [...tasks[selectedQuadrant], {
          id: Date.now(),
          text: newTask,
          completed: false
        }]
      });
      setNewTask('');
    }
  };

  const toggleTaskComplete = (quadrant, id) => {
    setTasks({
      ...tasks,
      [quadrant]: tasks[quadrant].map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const deleteTask = (quadrant, id) => {
    setTasks({
      ...tasks,
      [quadrant]: tasks[quadrant].filter(task => task.id !== id)
    });
  };

  // Goal functions
  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals({
        ...goals,
        backlog: [...goals.backlog, {
          id: Date.now(),
          text: newGoal,
          category: selectedGoalCategory
        }]
      });
      setNewGoal('');
    }
  };

  const moveGoal = (goalId, fromColumn, toColumn) => {
    const goal = goals[fromColumn].find(g => g.id === goalId);
    if (goal) {
      setGoals({
        ...goals,
        [fromColumn]: goals[fromColumn].filter(g => g.id !== goalId),
        [toColumn]: [...goals[toColumn], goal]
      });
    }
  };

  const deleteGoal = (column, id) => {
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
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Day Planning Dashboard</h1>
              <p className="text-gray-600 mt-1">Plan, prioritize, and achieve your daily goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <span className="text-indigo-800 font-semibold">{completionRate}% Complete</span>
              </div>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'schedule', label: 'Daily Schedule', icon: Clock },
              { id: 'priority', label: 'Priority Matrix', icon: Target },
              { id: 'goals', label: 'Goal Board', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Schedule Tab */}
        {activeTab === 'schedule' && (
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
            
            {/* Add Schedule Item */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="time"
                  value={newScheduleItem.time}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, time: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Task description"
                  value={newScheduleItem.task}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, task: e.target.value})}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newScheduleItem.category}
                  onChange={(e) => setNewScheduleItem({...newScheduleItem, category: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
                <button
                  onClick={addScheduleItem}
                  className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Schedule Items */}
            <div className="space-y-3">
              {scheduleItems
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => (
                <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 ${categories[item.category].color} ${item.completed ? 'bg-gray-50 opacity-75' : 'bg-white border border-gray-200'}`}>
                  <button
                    onClick={() => toggleScheduleComplete(item.id)}
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
                    onClick={() => deleteScheduleItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority Matrix Tab */}
        {activeTab === 'priority' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Priority Matrix</h2>
            
            {/* Add Task */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Add new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={selectedQuadrant}
                  onChange={(e) => setSelectedQuadrant(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(quadrants).map(([key, quad]) => (
                    <option key={key} value={key}>{quad.title}</option>
                  ))}
                </select>
                <button
                  onClick={addTask}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Priority Quadrants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(quadrants).map(([quadrantKey, quadrant]) => (
                <div key={quadrantKey} className={`border-2 rounded-lg p-4 ${quadrant.color}`}>
                  <h3 className="font-bold text-gray-800 mb-4">{quadrant.title}</h3>
                  <div className="space-y-2">
                    {tasks[quadrantKey].map(task => (
                      <div key={task.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm">
                        <button
                          onClick={() => toggleTaskComplete(quadrantKey, task.id)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          {task.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
                        </button>
                        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.text}
                        </span>
                        <button
                          onClick={() => deleteTask(quadrantKey, task.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Board Tab */}
        {activeTab === 'goals' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Goal Board</h2>
            
            {/* Add Goal */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Add new goal"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={selectedGoalCategory}
                  onChange={(e) => setSelectedGoalCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
                <button
                  onClick={addGoal}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Goal Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { key: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
                { key: 'today', title: 'Today', color: 'bg-blue-100' },
                { key: 'in_progress', title: 'In Progress', color: 'bg-yellow-100' },
                { key: 'completed', title: 'Completed', color: 'bg-green-100' }
              ].map(column => (
                <div key={column.key} className={`${column.color} rounded-lg p-4`}>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                    {column.title}
                    <span className="text-sm bg-white px-2 py-1 rounded-full">
                      {goals[column.key].length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {goals[column.key].map(goal => (
                      <div key={goal.id} className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-indigo-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm">{goal.text}</p>
                            <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 text-white ${categories[goal.category].color}`}>
                              {categories[goal.category].label}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteGoal(column.key, goal.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex space-x-1 mt-3">
                          {column.key !== 'backlog' && (
                            <button
                              onClick={() => moveGoal(goal.id, column.key, 'backlog')}
                              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                            >
                              ← Backlog
                            </button>
                          )}
                          {column.key !== 'today' && column.key !== 'completed' && (
                            <button
                              onClick={() => moveGoal(goal.id, column.key, 'today')}
                              className="text-xs bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded transition-colors"
                            >
                              → Today
                            </button>
                          )}
                          {column.key !== 'in_progress' && column.key !== 'completed' && (
                            <button
                              onClick={() => moveGoal(goal.id, column.key, 'in_progress')}
                              className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded transition-colors"
                            >
                              → Progress
                            </button>
                          )}
                          {column.key !== 'completed' && (
                            <button
                              onClick={() => moveGoal(goal.id, column.key, 'completed')}
                              className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded transition-colors"
                            >
                              ✓ Done
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPlanningDashboard;