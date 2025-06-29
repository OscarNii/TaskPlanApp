import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import TaskList from './TaskList';
import Calendar from './Calendar';
import KanbanBoard from './KanbanBoard';
import { useTask } from '../contexts/TaskContext';
import { useNotifications } from '../hooks/useNotifications';
import { Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { viewMode, setViewMode } = useTask();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Mock user ID - in a real app, this would come from auth context
  const userId = 'user-1';
  
  // Initialize notifications
  useNotifications(userId);

  // Update view mode based on current route
  useEffect(() => {
    switch (location.pathname) {
      case '/tasks':
        setViewMode('list');
        break;
      case '/kanban':
        setViewMode('kanban');
        break;
      case '/calendar':
        setViewMode('calendar');
        break;
      case '/':
      default:
        setViewMode('dashboard');
        break;
    }
  }, [location.pathname, setViewMode]);

  const renderMainContent = () => {
    switch (viewMode) {
      case 'list':
        return <TaskList />;
      case 'kanban':
        return <KanbanBoard />;
      case 'calendar':
        return <Calendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-300 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
        >
          {sidebarOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-80 min-h-screen">
        <Header />
        <main className="p-4 lg:p-8 relative z-10">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;