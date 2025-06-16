import React from 'react';
import { useTask } from '../contexts/TaskContext';
import TaskCard from './TaskCard';
import { CheckCircle } from 'lucide-react';

const TaskList: React.FC = () => {
  const { getFilteredTasks } = useTask();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Tasks</h2>
          <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {filteredTasks.length} tasks
          </span>
        </div>

        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <div className="text-center py-12 text-white/60">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">Try adjusting your filters or add a new task</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;