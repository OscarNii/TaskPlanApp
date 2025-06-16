import React, { useState } from 'react';
import { useTask } from '../contexts/TaskContext';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import TaskCard from './TaskCard';

function Calendar() {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors backdrop-blur-sm border border-blue-400/30"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-white/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-24 bg-white/5 rounded-lg" />;
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const tasksForDay = getTasksForDate(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div
                key={day}
                className={`h-24 p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors ${isToday ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent bg-blue-500/10' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? 'text-blue-300' : 'text-white/80'}`}>
                    {day}
                  </span>
                  {tasksForDay.length > 0 && (
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-1 rounded border border-blue-400/30">
                      {tasksForDay.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {tasksForDay.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded truncate backdrop-blur-sm ${task.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                            'bg-green-500/20 text-green-300 border border-green-400/30'}`}
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasksForDay.length > 2 && (
                    <div className="text-xs text-white/50">
                      +{tasksForDay.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">
          Today's Tasks
        </h3>
        <div className="space-y-3">
          {getTasksForDate(today).length > 0 ? (
            getTasksForDate(today).map(task => (
              <TaskCard key={task.id} task={task} compact />
            ))
          ) : (
            <p className="text-white/60 text-center py-8">
              No tasks scheduled for today
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;