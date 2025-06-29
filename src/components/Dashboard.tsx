import React from 'react';
import { useTask } from '../contexts/TaskContext';
import TaskCard from './TaskCard';
import StatsCard from './StatsCard';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { getFilteredTasks, getTaskStats, tasks } = useTask();
  const filteredTasks = getFilteredTasks();
  const stats = getTaskStats();
  
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate.toDateString() === today.toDateString();
  });

  const overdueTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    return taskDate && taskDate < today && !task.completed;
  });

  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning! ☀️';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon! 🌤️';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good evening! 🌅';
    } else {
      return 'Good night! 🌙';
    }
  };

  // Function to get time-based message
  const getTimeBasedMessage = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return `You have ${stats.pending} tasks to tackle today`;
    } else if (currentHour >= 12 && currentHour < 17) {
      return `You have ${stats.pending} tasks remaining for today`;
    } else if (currentHour >= 17 && currentHour < 21) {
      return `You have ${stats.pending} tasks to wrap up`;
    } else {
      return `You have ${stats.pending} tasks for tomorrow`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-600/20 backdrop-blur-2xl rounded-2xl p-8 text-white border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-white/80 text-lg">{getTimeBasedMessage()}</p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="text-3xl font-bold text-white">{completionRate}%</div>
              <div className="text-sm text-white/80">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={Target}
          color="blue"
          trend="+12%"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
          trend="+8%"
        />
        <StatsCard
          title="Due Today"
          value={todayTasks.length}
          icon={Calendar}
          color="orange"
          trend="-3%"
        />
        <StatsCard
          title="Overdue"
          value={overdueTasks.length}
          icon={AlertTriangle}
          color="red"
          trend="-15%"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Due Today
            </h2>
            <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {todayTasks.length} tasks
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No tasks due today</p>
              </div>
            )}
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              High Priority
            </h2>
            <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {highPriorityTasks.length} tasks
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <div className="text-center py-8 text-white/60">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No high priority tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
            All Tasks
          </h2>
          <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {filteredTasks.length} tasks
          </span>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-12 text-white/60">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No tasks found</p>
              <p className="text-sm">Try adjusting your filters or add a new task</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;