import React, { useState, useEffect } from 'react';
import { useTask } from '../contexts/TaskContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar,
  Plus,
  Settings,
  X,
  LogOut,
  User
} from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface SidebarProps {
  onClose: () => void;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  loginTime: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { projects, viewMode, setViewMode, getTaskStats } = useTask();
  const navigate = useNavigate();
  const [showAddProject, setShowAddProject] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const stats = getTaskStats();

  // Check for logged in user
  useEffect(() => {
    const userData = localStorage.getItem('taskflow-user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('taskflow-user');
      }
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const userData = localStorage.getItem('taskflow-user');
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('taskflow-user');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const navigationItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      count: stats.total,
      path: '/',
      onClick: () => setViewMode('dashboard')
    },
    { 
      id: 'tasks', 
      icon: CheckSquare, 
      label: 'Tasks', 
      count: stats.pending,
      path: '/tasks',
      onClick: () => setViewMode('list')
    },
    { 
      id: 'calendar', 
      icon: Calendar, 
      label: 'Calendar', 
      count: null,
      path: '/calendar',
      onClick: () => setViewMode('calendar')
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('taskflow-user');
    setCurrentUser(null);
    setShowUserMenu(false);
    
    // Trigger auth state change
    window.dispatchEvent(new CustomEvent('auth-change'));
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleNavigation = (item: typeof navigationItems[0]) => {
    item.onClick();
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLoginTime = (loginTime: string) => {
    const date = new Date(loginTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const truncateEmail = (email: string, maxLength: number = 20) => {
    if (email.length <= maxLength) return email;
    const [localPart, domain] = email.split('@');
    if (localPart.length > maxLength - domain.length - 3) {
      return `${localPart.slice(0, maxLength - domain.length - 6)}...@${domain}`;
    }
    return email;
  };

  return (
    <>
      <div className="h-full bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 flex flex-col shadow-2xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
              onClick={() => {
                setViewMode('dashboard');
                onClose();
              }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Link
              to="/tasks"
              onClick={() => {
                setViewMode('list');
                onClose();
              }}
              className="bg-gradient-to-br from-emerald-400/20 to-blue-500/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block"
            >
              <div className="text-lg sm:text-2xl font-bold text-white">{stats.completed}</div>
              <div className="text-xs sm:text-sm text-white/80">Completed</div>
            </Link>
            <Link
              to="/tasks"
              onClick={() => {
                setViewMode('list');
                onClose();
              }}
              className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 block"
            >
              <div className="text-lg sm:text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-xs sm:text-sm text-white/80">Pending</div>
            </Link>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation - Fixed */}
          <nav className="flex-shrink-0 p-3 sm:p-4 space-y-1 sm:space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 group ${
                  viewMode === item.id || (item.id === 'tasks' && viewMode === 'list')
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm text-white shadow-lg border border-white/20'
                    : 'hover:bg-white/10 dark:hover:bg-white/5 text-white/80 hover:text-white'
                }`}
              >
                <item.icon size={18} className="transition-transform group-hover:scale-110 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
                {item.count !== null && (
                  <span className={`ml-auto px-2 py-1 text-xs rounded-full transition-all flex-shrink-0 ${
                    viewMode === item.id || (item.id === 'tasks' && viewMode === 'list')
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-white/10 text-white/70 group-hover:bg-white/20'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Projects Section - Scrollable */}
          <div className="flex-1 flex flex-col min-h-0 border-t border-white/20 dark:border-white/10">
            <div className="flex-shrink-0 p-3 sm:p-4 pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-white/80 uppercase tracking-wide">
                  Projects
                </h3>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg transition-colors text-white/80 hover:text-white hover:scale-110"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Projects List */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 space-y-1 sm:space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <Link
                    key={project.id}
                    to="/tasks"
                    onClick={() => {
                      setViewMode('list');
                      onClose();
                    }}
                    className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer backdrop-blur-sm group hover:scale-105"
                  >
                    <div 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-sm flex-shrink-0 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-xs sm:text-sm text-white/90 font-medium flex-1 truncate group-hover:text-white">
                      {project.name}
                    </span>
                    <span className="text-xs text-white/60 bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0 group-hover:bg-white/20 group-hover:text-white/80 transition-all">
                      {project.taskCount}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-white/50">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Plus size={16} className="text-white/40" />
                  </div>
                  <p className="text-xs sm:text-sm">No projects yet</p>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="text-xs mt-1 text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t border-white/20 dark:border-white/10">
          {/* Settings */}
          <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
            <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 text-white/80 hover:text-white group">
              <Settings size={18} className="transition-transform group-hover:scale-110 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Settings</span>
            </button>
          </div>

          {/* User Section - Responsive */}
          <div className="p-3 sm:p-4 border-t border-white/20 dark:border-white/10">
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 text-white/80 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 text-white font-semibold text-xs sm:text-sm">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white truncate">{currentUser.name}</div>
                    <div className="text-xs text-white/60 truncate">
                      <span className="hidden sm:inline">Active </span>{formatLoginTime(currentUser.loginTime)}
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 text-white/80 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                    <User size={14} className="text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-white">Sign In</div>
                    <div className="text-xs text-white/60">Access your tasks</div>
                  </div>
                </button>
              )}

              {showUserMenu && currentUser && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50">
                  <div className="p-3 sm:p-4 border-b border-white/20">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(currentUser.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-white truncate">{currentUser.name}</div>
                        <div className="text-xs text-white/60 truncate" title={currentUser.email}>
                          {truncateEmail(currentUser.email)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile settings
                    }}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-white/10 transition-colors text-white/80 hover:text-white flex items-center space-x-2 sm:space-x-3"
                  >
                    <User size={14} />
                    <span className="text-xs sm:text-sm">Profile Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300 flex items-center space-x-2 sm:space-x-3"
                  >
                    <LogOut size={14} />
                    <span className="text-xs sm:text-sm">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
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