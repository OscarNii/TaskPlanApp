import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Project, FilterOptions, ViewMode } from '../types';
import { mockTasks, mockProjects } from '../data/mockData';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  filterOptions: FilterOptions;
  viewMode: ViewMode;
  setFilterOptions: (options: FilterOptions) => void;
  setViewMode: (mode: ViewMode) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'taskCount' | 'completedTasks'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getFilteredTasks: () => Task[];
  getTaskStats: () => { total: number; completed: number; pending: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    project: 'all',
    status: 'all',
    dateRange: 'all',
  });

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task
    ));
  };

  const addProject = (projectData: Omit<Project, 'id' | 'taskCount' | 'completedTasks'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      taskCount: 0,
      completedTasks: 0,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setTasks(prev => prev.filter(task => task.projectId !== id));
  };

  const getFilteredTasks = (): Task[] => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filterOptions.search.toLowerCase()) ||
                           task.description.toLowerCase().includes(filterOptions.search.toLowerCase());
      const matchesPriority = filterOptions.priority === 'all' || task.priority === filterOptions.priority;
      const matchesProject = filterOptions.project === 'all' || task.projectId === filterOptions.project;
      const matchesStatus = filterOptions.status === 'all' || 
                           (filterOptions.status === 'completed' && task.completed) ||
                           (filterOptions.status === 'pending' && !task.completed);
      
      let matchesDateRange = true;
      if (filterOptions.dateRange !== 'all' && task.dueDate) {
        const today = new Date();
        const taskDate = new Date(task.dueDate);
        
        switch (filterOptions.dateRange) {
          case 'today':
            matchesDateRange = taskDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            matchesDateRange = taskDate >= today && taskDate <= weekFromNow;
            break;
          case 'month':
            const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            matchesDateRange = taskDate >= today && taskDate <= monthFromNow;
            break;
        }
      }

      return matchesSearch && matchesPriority && matchesProject && matchesStatus && matchesDateRange;
    });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  // Update project task counts
  useEffect(() => {
    setProjects(prev => prev.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const completedTasks = projectTasks.filter(task => task.completed).length;
      return {
        ...project,
        taskCount: projectTasks.length,
        completedTasks,
      };
    }));
  }, [tasks]);

  const value: TaskContextType = {
    tasks,
    projects,
    filterOptions,
    viewMode,
    setFilterOptions,
    setViewMode,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addProject,
    updateProject,
    deleteProject,
    getFilteredTasks,
    getTaskStats,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};