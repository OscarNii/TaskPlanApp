import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
import { Task } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddTaskModalProps {
  onClose: () => void;
  onAdd: () => void;
  defaultStatus?: Task['status'];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAdd, defaultStatus = 'todo' }) => {
  const { addTask, projects } = useTask();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    projectId: projects[0]?.id || '',
    tags: [] as string[],
    subtasks: [] as { id: string; title: string; completed: boolean }[],
    status: defaultStatus,
  });
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addTask({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      completed: formData.status === 'done',
    });
    onAdd();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, {
          id: Date.now().toString(),
          title: newSubtask.trim(),
          completed: false
        }]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== id)
    }));
  };

  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'text-slate-300' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-300' },
    { value: 'review', label: 'Review', color: 'text-amber-300' },
    { value: 'done', label: 'Done', color: 'text-green-300' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add New Task</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/60"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/60"
              rows={3}
              placeholder="Enter task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
              >
                <option value="low" className="bg-slate-800">Low</option>
                <option value="medium" className="bg-slate-800">Medium</option>
                <option value="high" className="bg-slate-800">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white"
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id} className="bg-slate-800">{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-400/30 backdrop-blur-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/60"
                placeholder="Add tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-colors backdrop-blur-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Subtasks
            </label>
            <div className="space-y-2 mb-2">
              {formData.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                  <span className="flex-1 text-sm text-white/90">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(subtask.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-3 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 bg-white/10 backdrop-blur-xl text-white placeholder-white/60"
                placeholder="Add subtask..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-3 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-colors backdrop-blur-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 text-white rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-colors backdrop-blur-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;