import React from 'react';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import TaskCard from './TaskCard';
import StatsCard from './StatsCard';
import AIAssistant from './AIAssistant';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Target,
  Bot,
  Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { getFilteredTasks, getTaskStats, tasks } = useTask();
  const { user, profile } = useAuth();
  const [showAIAssistant, setShowAIAssistant] = React.useState(false);
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

  // Get user's first name for personalization
  const getFirstName = () => {
    if (!user || !profile) return 'there';
    const fullName = profile.name || user.name || 'User';
    return fullName.split(' ')[0];
  };

  // Function to get time-based greeting with user name
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    const firstName = getFirstName();
    
    if (currentHour >= 5 && currentHour < 12) {
      return `Good morning, ${firstName}! ☀️`;
    } else if (currentHour >= 12 && currentHour < 17) {
      return `Good afternoon, ${firstName}! 🌤️`;
    } else if (currentHour >= 17 && currentHour < 21) {
      return `Good evening, ${firstName}! 🌅`;
    } else {
      return `Good night, ${firstName}! 🌙`;
    }
  };

  // Function to get time-based message with user context
  const getTimeBasedMessage = () => {
    const currentHour = new Date().getHours();
    const firstName = getFirstName();
    
    if (stats.pending === 0) {
      if (currentHour >= 5 && currentHour < 12) {
        return `You're all caught up! Perfect way to start the day.`;
      } else if (currentHour >= 12 && currentHour < 17) {
        return `Excellent work! You've completed all your tasks.`;
      } else if (currentHour >= 17 && currentHour < 21) {
        return `Amazing! You've finished everything for today.`;
      } else {
        return `Well done! You can rest easy tonight.`;
      }
    }
    
    if (currentHour >= 5 && currentHour < 12) {
      return `Ready to tackle ${stats.pending} task${stats.pending !== 1 ? 's' : ''} today? Let's make it productive!`;
    } else if (currentHour >= 12 && currentHour < 17) {
      return `You have ${stats.pending} task${stats.pending !== 1 ? 's' : ''} remaining. Keep up the momentum!`;
    } else if (currentHour >= 17 && currentHour < 21) {
      return `${stats.pending} task${stats.pending !== 1 ? 's' : ''} left to wrap up. You're almost there!`;
    } else {
      return `${stats.pending} task${stats.pending !== 1 ? 's' : ''} for tomorrow. Rest well and tackle them fresh!`;
    }
  };

  // Function to get motivational subtitle based on completion rate
  const getMotivationalSubtitle = () => {
    if (stats.total === 0) {
      return "Start by adding your first task to get organized!";
    }
    
    if (completionRate === 100) {
      return "🎉 Perfect! You've completed everything!";
    } else if (completionRate >= 80) {
      return "🔥 You're on fire! Almost there!";
    } else if (completionRate >= 60) {
      return "💪 Great progress! Keep it up!";
    } else if (completionRate >= 40) {
      return "📈 You're making steady progress!";
    } else if (completionRate >= 20) {
      return "🚀 Good start! Let's build momentum!";
    } else {
      return "✨ Every journey begins with a single step!";
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-600/20 backdrop-blur-2xl rounded-2xl p-8 text-white border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {getTimeBasedGreeting()}
              </h1>
              <p className="text-white/80 text-lg mb-2">{getTimeBasedMessage()}</p>
              <p className="text-white/60 text-base">{getMotivationalSubtitle()}</p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-3xl font-bold text-white">{completionRate}%</div>
                <div className="text-sm text-white/80">Completion Rate</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Quick Access */}
        <div className="bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-600/20 backdrop-blur-2xl rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center">
                  AI Productivity Assistant
                  <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
                </h3>
                <p className="text-white/70 text-sm">Get personalized task suggestions and productivity tips</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIAssistant(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-600 text-white rounded-xl transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Chat with AI
            </button>
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
                {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}
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
                  <p className="text-sm mt-1">Enjoy your free time! 🎉</p>
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
                {highPriorityTasks.length} task{highPriorityTasks.length !== 1 ? 's' : ''}
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
                  <p className="text-sm mt-1">You're managing priorities well! 👍</p>
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
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
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
                <p className="text-sm">Try adjusting your filters or add a new task to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </>
  );
};

export default Dashboard;