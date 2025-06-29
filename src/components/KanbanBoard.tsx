import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTask } from '../contexts/TaskContext';
import { Task, KanbanColumn } from '../types';
import KanbanCard from './KanbanCard';
import AddTaskModal from './AddTaskModal';
import { 
  Plus, 
  Circle, 
  Clock, 
  Eye, 
  CheckCircle2,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    color: 'from-slate-500/30 to-slate-600/30',
    icon: 'Circle',
    description: 'Tasks ready to start'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    color: 'from-blue-500/30 to-blue-600/30',
    icon: 'Clock',
    description: 'Currently working on'
  },
  {
    id: 'review',
    title: 'Review',
    status: 'review',
    color: 'from-amber-500/30 to-amber-600/30',
    icon: 'Eye',
    description: 'Awaiting feedback'
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    color: 'from-green-500/30 to-green-600/30',
    icon: 'CheckCircle2',
    description: 'Completed tasks'
  }
];

const KanbanBoard: React.FC = () => {
  const { tasks, updateTask, getFilteredTasks, filterOptions, setFilterOptions } = useTask();
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Task['status']>('todo');
  const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null);

  // Get filtered tasks and organize by status
  const filteredTasks = getFilteredTasks();
  
  const tasksByStatus = useMemo(() => {
    const organized: Record<Task['status'], Task[]> = {
      'todo': [],
      'in-progress': [],
      'review': [],
      'done': []
    };

    filteredTasks.forEach(task => {
      // Map completed status to kanban status
      let status: Task['status'] = task.status || 'todo';
      
      // If task doesn't have a status but is completed, put it in done
      if (task.completed && !task.status) {
        status = 'done';
      }
      
      organized[status].push(task);
    });

    return organized;
  }, [filteredTasks]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, return
    if (!destination) return;

    // If dropped in the same position, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task['status'];
    const taskId = draggableId;

    // Update task status
    await updateTask(taskId, { 
      status: newStatus,
      completed: newStatus === 'done'
    });

    // Show success feedback
    console.log(`✅ Task moved to ${newStatus}`);
  };

  const getColumnIcon = (iconName: string) => {
    switch (iconName) {
      case 'Circle':
        return <Circle className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'Eye':
        return <Eye className="w-5 h-5" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getColumnStats = (status: Task['status']) => {
    const columnTasks = tasksByStatus[status];
    const total = columnTasks.length;
    const highPriority = columnTasks.filter(task => task.priority === 'high').length;
    const overdue = columnTasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length;

    return { total, highPriority, overdue };
  };

  const handleAddTaskToColumn = (status: Task['status']) => {
    setSelectedColumn(status);
    setShowAddTask(true);
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

  const hasActiveFilters = filterOptions.search || 
    filterOptions.priority !== 'all' || 
    filterOptions.project !== 'all' || 
    filterOptions.status !== 'all' || 
    filterOptions.dateRange !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Kanban Board</h2>
            <p className="text-white/70">Drag and drop tasks between columns to update their status</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filterOptions.search}
                onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-white/60 text-sm w-64"
              />
            </div>

            {/* Filter indicator */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm border border-blue-400/30"
              >
                <Filter className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            )}

            {/* Stats */}
            <div className="hidden lg:flex items-center space-x-4 text-sm text-white/70">
              <span>{filteredTasks.length} tasks</span>
              <span>•</span>
              <span>{filteredTasks.filter(t => t.completed).length} completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {KANBAN_COLUMNS.map((column) => {
            const stats = getColumnStats(column.status);
            
            return (
              <div key={column.id} className="flex flex-col h-full">
                {/* Column Header */}
                <div className={`bg-gradient-to-br ${column.color} backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-lg mb-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-white">
                        {getColumnIcon(column.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{column.title}</h3>
                        <p className="text-xs text-white/70">{column.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowColumnMenu(showColumnMenu === column.id ? null : column.id)}
                        className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {showColumnMenu === column.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white/10 backdrop-blur-xl rounded-lg shadow-lg border border-white/20 z-10">
                          <button
                            onClick={() => {
                              handleAddTaskToColumn(column.status);
                              setShowColumnMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-white/10 flex items-center space-x-2 text-white/80 hover:text-white rounded-t-lg"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Task</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-white/90 font-medium">{stats.total} tasks</span>
                      {stats.highPriority > 0 && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs border border-red-400/30">
                          {stats.highPriority} high
                        </span>
                      )}
                      {stats.overdue > 0 && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs border border-orange-400/30">
                          {stats.overdue} overdue
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddTaskToColumn(column.status)}
                      className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-xl transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-white/5 border-2 border-dashed border-white/30' 
                          : 'border-2 border-transparent'
                      }`}
                    >
                      {tasksByStatus[column.status].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging 
                                  ? 'rotate-3 scale-105 shadow-2xl' 
                                  : 'hover:scale-102'
                              }`}
                            >
                              <KanbanCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {/* Empty state */}
                      {tasksByStatus[column.status].length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-white/40">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-3">
                            {getColumnIcon(column.icon)}
                          </div>
                          <p className="text-sm text-center">No tasks in {column.title.toLowerCase()}</p>
                          <button
                            onClick={() => handleAddTaskToColumn(column.status)}
                            className="mt-2 text-xs text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            Add first task
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAdd={() => setShowAddTask(false)}
          defaultStatus={selectedColumn}
        />
      )}
    </div>
  );
};

export default KanbanBoard;