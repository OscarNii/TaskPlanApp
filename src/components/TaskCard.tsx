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
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false }) => {
  const { toggleTask, deleteTask, projects } = useTask();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const project = projects.find(p => p.id === task.projectId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

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
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <div className={`group bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 transition-all duration-300 ${
        compact ? 'p-3' : 'p-4'
      } ${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-400/50 bg-red-500/10' : ''} shadow-lg hover:shadow-xl`}>
        <div className="flex items-start space-x-3">
          <button
            onClick={() => toggleTask(task.id)}
            className="flex-shrink-0 mt-1 transition-colors duration-200"
          >
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-white/60 hover:text-blue-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${task.completed ? 'line-through text-white/50' : 'text-white'} ${compact ? 'text-sm' : ''}`}>
                  {task.title}
                </h3>
                {!compact && task.description && (
                  <p className="text-sm text-white/70 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm border ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-white/10 dark:hover:bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-32 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 dark:border-white/10 z-10">
                      <button
                        onClick={() => {
                          setShowEdit(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 dark:hover:bg-white/5 flex items-center space-x-2 text-white/80 hover:text-white"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          deleteTask(task.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!compact && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4">
                  {task.dueDate && (
                    <div className={`flex items-center space-x-1 text-sm ${
                      isOverdue ? 'text-red-400' : 'text-white/60'
                    }`}>
                      <Calendar size={14} />
                      <span>{formatDate(new Date(task.dueDate))}</span>
                    </div>
                  )}
                  {project && (
                    <div className="flex items-center space-x-1 text-sm text-white/60">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span>{project.name}</span>
                    </div>
                  )}
                </div>

                {task.subtasks.length > 0 && (
                  <button
                    onClick={() => setShowSubtasks(!showSubtasks)}
                    className="flex items-center space-x-1 text-sm text-white/60 hover:text-white/80"
                  >
                    {showSubtasks ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks</span>
                  </button>
                )}
              </div>
            )}

            {showSubtasks && task.subtasks.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-white/20 space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 flex items-center justify-center">
                      {subtask.completed && <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />}
                    </div>
                    <span className={`text-sm ${subtask.completed ? 'line-through text-white/50' : 'text-white/80'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
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

export default TaskCard;