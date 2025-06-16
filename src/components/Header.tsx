import React from 'react';
import { useTask } from '../contexts/TaskContext';
import { Search, Filter, Plus } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import FilterModal from './FilterModal';

const Header: React.FC = () => {
  const { filterOptions, setFilterOptions } = useTask();
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);

  return (
    <>
      <header className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 p-4 lg:p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
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
          
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={() => setShowFilter(true)}
              className="p-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl hover:bg-white/20 dark:hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl text-white/80 hover:text-white"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl border border-white/20"
            >
              <Plus size={20} />
              <span className="hidden sm:block font-medium">Add Task</span>
            </button>
          </div>
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
    </>
  );
};

export default Header;