import React, { useState } from 'react';
import { Task } from '../types';
import { useTask } from '../contexts/TaskContext';
import { 
  Calendar,
  Clock,
  Flag,
  MoreHorizontal,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  User,
  MessageSquare,
  Paperclip,
  AlertTriangle
} from 'lucide-react';
import EditTaskModal from './EditTaskModal';

interface KanbanCardProps {
  task: Task;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const { toggleTask, deleteTask, projects } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();
  const isDueTomorrow = task.dueDate && new Date(task.dueDate).toDateString() === new Date(Date.now() + 86400000).toDateString();

  const priorityColors = {
    low: 'text-green-300 bg-green-500/20 border-green-400/30',
    medium: 'text-yellow-300 bg-yellow-500/20 border-yellow-400/30',
    high: 'text-red-300 bg-red-500/20 border-red-400/30',
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getDateColor = () => {
    if (isOverdue) return 'text-red-400 bg-red-500/10 border-red-400/30';
    if (isDueToday) return 'text-orange-400 bg-orange-500/10 border-orange-400/30';
    if (isDueTomorrow) return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
    return 'text-white/60 bg-white/5 border-white/20';
  };

  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <>
      <div className={`group bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 p-4 shadow-lg hover:shadow-xl cursor-grab active:cursor-grabbing ${
        task.completed ? 'opacity-75' : ''
      } ${isOverdue ? 'border-red-400/50 bg-red-500/5' : ''}`}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTask(task.id);
              }}
              className="flex-shrink-0 transition-colors duration-200"
            >
              {task.completed ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Circle className="w-4 h-4 text-white/60 hover:text-blue-400" />
              )}
            </button>
            
            <span className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-white/10 dark:hover:bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white"
            >
              <MoreHorizontal size={14} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-6 w-32 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 dark:border-white/10 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEdit(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 dark:hover:bg-white/5 flex items-center space-x-2 text-white/80 hover:text-white rounded-t-lg"
                >
                  <Edit size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2 rounded-b-lg"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-medium text-sm mb-2 line-clamp-2 ${task.completed ? 'line-through text-white/50' : 'text-white'}`}>
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-white/70 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>Subtasks</span>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${subtaskProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-400/30 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs border border-white/20">
                +{task.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {/* Project */}
            {project && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-white/60 truncate max-w-[60px]">{project.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getDateColor()}`}>
                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                <span className="font-medium">{formatDate(new Date(task.dueDate))}</span>
              </div>
            )}

            {/* Additional indicators */}
            <div className="flex items-center space-x-1">
              {task.subtasks.length > 0 && (
                <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-2.5 h-2.5 text-white/60" />
                </div>
              )}
              
              {task.description && (
                <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-2.5 h-2.5 text-white/60" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEdit(false)}
          onSave={() => setShowEdit(false)}
        />
      )}
    </>
  );
};

export default KanbanCard;