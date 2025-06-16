import React from 'react';
import { useTask } from '../contexts/TaskContext';
import { X } from 'lucide-react';

interface FilterModalProps {
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
  const { filterOptions, setFilterOptions, projects } = useTask();

  const handleFilterChange = (key: string, value: string) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
  };

  const clearFilters = () => {
    setFilterOptions({
      search: '',
      priority: 'all',
      project: 'all',
      status: 'all',
      dateRange: 'all',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Filter Tasks</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Priority
            </label>
            <select
              value={filterOptions.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
            >
              <option value="all" className="bg-slate-800">All Priorities</option>
              <option value="low" className="bg-slate-800">Low</option>
              <option value="medium" className="bg-slate-800">Medium</option>
              <option value="high" className="bg-slate-800">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Project
            </label>
            <select
              value={filterOptions.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
            >
              <option value="all" className="bg-slate-800">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id} className="bg-slate-800">{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Status
            </label>
            <select
              value={filterOptions.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
            >
              <option value="all" className="bg-slate-800">All Tasks</option>
              <option value="pending" className="bg-slate-800">Pending</option>
              <option value="completed" className="bg-slate-800">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Due Date
            </label>
            <select
              value={filterOptions.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
            >
              <option value="all" className="bg-slate-800">All Dates</option>
              <option value="today" className="bg-slate-800">Today</option>
              <option value="week" className="bg-slate-800">This Week</option>
              <option value="month" className="bg-slate-800">This Month</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Clear Filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors backdrop-blur-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;