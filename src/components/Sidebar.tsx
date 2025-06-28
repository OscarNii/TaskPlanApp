import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar,
  Plus,
  Moon,
  Sun,
  Settings,
  X,
  LogOut,
  User
} from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { projects, viewMode, setViewMode, getTaskStats } = useTask();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showAddProject, setShowAddProject] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const stats = getTaskStats();

  const navigationItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', count: stats.total },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks', count: stats.pending },
    { id: 'calendar', icon: Calendar, label: 'Calendar', count: null },
  ];

  const handleLogout = () => {
    // In a real app, you'd clear auth tokens here
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="h-full bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-400/20 to-blue-500/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-white/10 shadow-lg">
              <div className="text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-sm p-4 rounded-xl border border-white/20 dark:border-white/10 shadow-lg">
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-sm text-white/80">Pending</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setViewMode(item.id as any);
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                viewMode === item.id
                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm text-white shadow-lg border border-white/20'
                  : 'hover:bg-white/10 dark:hover:bg-white/5 text-white/80 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.count !== null && (
                <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
                  viewMode === item.id
                    ? 'bg-white/20 text-white backdrop-blur-sm'
                    : 'bg-white/10 text-white/70'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="p-4 border-t border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
              Projects
            </h3>
            <button
              onClick={() => setShowAddProject(true)}
              className="p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors cursor-pointer backdrop-blur-sm"
              >
                <div 
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-sm text-white/90 font-medium flex-1">
                  {project.name}
                </span>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {project.taskCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-4 border-t border-white/20 dark:border-white/10 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-white/80 hover:text-white"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-white/80 hover:text-white">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/20 dark:border-white/10">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-white/80 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">Guest User</div>
                <div className="text-xs text-white/60">guest@taskflow.com</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white/80 hover:text-white flex items-center space-x-3"
                >
                  <User size={16} />
                  <span className="text-sm">Sign In</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300 flex items-center space-x-3"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddProject && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onAdd={() => setShowAddProject(false)}
        />
      )}
    </>
  );
};

export default Sidebar;