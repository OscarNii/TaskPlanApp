import React from 'react';
import { useTask } from '../contexts/TaskContext';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, Plus, ArrowLeft, Bell } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import FilterModal from './FilterModal';
import NotificationCenter from './NotificationCenter';

const Header: React.FC = () => {
  const { filterOptions, setFilterOptions, viewMode } = useTask();
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const location = useLocation();

  // Mock user ID - in a real app, this would come from auth context
  const userId = 'user-1';

  const getPageTitle = () => {
    switch (viewMode) {
      case 'list':
        return 'All Tasks';
      case 'calendar':
        return 'Calendar View';
      default:
        return 'Dashboard';
    }
  };

  const getBreadcrumb = () => {
    switch (viewMode) {
      case 'list':
        return [
          { label: 'Home', path: '/' },
          { label: 'Tasks', path: '/tasks' }
        ];
      case 'calendar':
        return [
          { label: 'Home', path: '/' },
          { label: 'Calendar', path: '/calendar' }
        ];
      default:
        return [{ label: 'Dashboard', path: '/' }];
    }
  };

  return (
    <>
      <header className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 p-4 lg:p-6 shadow-lg">
        <div className="flex flex-col space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm">
            {getBreadcrumb().map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && (
                  <span className="text-white/40">/</span>
                )}
                <Link
                  to={crumb.path}
                  className={`transition-colors ${
                    index === getBreadcrumb().length - 1
                      ? 'text-white font-medium'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Main Header Content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {viewMode !== 'dashboard' && (
                <Link
                  to="/"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white lg:hidden"
                >
                  <ArrowLeft size={20} />
                </Link>
              )}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {getPageTitle()}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {viewMode === 'list' && 'Manage and organize your tasks'}
                  {viewMode === 'calendar' && 'View tasks by date and schedule'}
                  {viewMode === 'dashboard' && 'Overview of your productivity'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search - only show on task list */}
              {viewMode === 'list' && (
                <div className="hidden sm:block relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filterOptions.search}
                    onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                    className="w-64 pl-12 pr-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-white placeholder-white/60 shadow-lg"
                  />
                </div>
              )}

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl text-white/80 hover:text-white"
              >
                <Bell size={20} />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white/20"></span>
              </button>

              {/* Filter button - only show on task list */}
              {viewMode === 'list' && (
                <button
                  onClick={() => setShowFilter(true)}
                  className="p-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl text-white/80 hover:text-white"
                >
                  <Filter size={20} />
                </button>
              )}

              {/* Add Task button */}
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20"
              >
                <Plus size={20} />
                <span className="hidden sm:block font-medium">Add Task</span>
              </button>
            </div>
          </div>

          {/* Mobile Search - only show on task list */}
          {viewMode === 'list' && (
            <div className="sm:hidden">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={filterOptions.search}
                  onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300 text-white placeholder-white/60 shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={() => setShowAddTask(false)}
        />
      )}

      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
        />
      )}

      {showNotifications && (
        <NotificationCenter
          userId={userId}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </>
  );
};

export default Header;