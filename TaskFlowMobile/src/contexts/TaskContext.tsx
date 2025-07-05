import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Project, FilterOptions, ViewMode } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  projects: Project[];
  filterOptions: FilterOptions;
  viewMode: ViewMode;
  loading: boolean;
  setFilterOptions: (options: FilterOptions) => void;
  setViewMode: (mode: ViewMode) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'taskCount' | 'completedTasks'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getFilteredTasks: () => Task[];
  getTaskStats: () => { total: number; completed: number; pending: number };
  refreshData: () => Promise<void>;
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
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    project: 'all',
    status: 'all',
    dateRange: 'all',
  });

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadUserData();
      } else {
        setTasks([]);
        setProjects([]);
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await Promise.all([loadProjects(), loadTasks()]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageKey = (type: 'tasks' | 'projects') => {
    return `taskflow-${type}-${user?.id}`;
  };

  const loadProjects = async () => {
    if (!user) return;

    try {
      const storageKey = getStorageKey('projects');
      const savedProjects = await AsyncStorage.getItem(storageKey);
      
      if (savedProjects) {
        const projectsData = JSON.parse(savedProjects);
        setProjects(projectsData);
      } else {
        const defaultProjects = [
          {
            id: 'project-1',
            name: 'Personal',
            color: '#3B82F6',
            taskCount: 0,
            completedTasks: 0,
          },
          {
            id: 'project-2',
            name: 'Work',
            color: '#10B981',
            taskCount: 0,
            completedTasks: 0,
          },
          {
            id: 'project-3',
            name: 'Health',
            color: '#8B5CF6',
            taskCount: 0,
            completedTasks: 0,
          },
        ];
        
        await AsyncStorage.setItem(storageKey, JSON.stringify(defaultProjects));
        setProjects(defaultProjects);
      }
    } catch (error) {
      console.error('Error in loadProjects:', error);
    }
  };

  const loadTasks = async () => {
    if (!user) return;

    try {
      const storageKey = getStorageKey('tasks');
      const savedTasks = await AsyncStorage.getItem(storageKey);
      
      if (savedTasks) {
        const tasksData = JSON.parse(savedTasks);
        const transformedTasks = tasksData.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          status: task.status || (task.completed ? 'done' : 'todo'),
        }));
        setTasks(transformedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error in loadTasks:', error);
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    if (!user) return;
    const storageKey = getStorageKey('tasks');
    await AsyncStorage.setItem(storageKey, JSON.stringify(tasksToSave));
  };

  const saveProjects = async (projectsToSave: Project[]) => {
    if (!user) return;
    const storageKey = getStorageKey('projects');
    await AsyncStorage.setItem(storageKey, JSON.stringify(projectsToSave));
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: taskData.status || 'todo',
      };

      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      console.log('✅ Task added successfully:', newTask.title);
    } catch (error) {
      console.error('Error in addTask:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      );
      
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      console.log('✅ Task updated successfully:', id);
    } catch (error) {
      console.error('Error in updateTask:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      
      console.log('✅ Task deleted successfully:', id);
    } catch (error) {
      console.error('Error in deleteTask:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    const newStatus = newCompleted ? 'done' : 'todo';

    await updateTask(id, { 
      completed: newCompleted,
      status: newStatus
    });
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'taskCount' | 'completedTasks'>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const newProject: Project = {
        ...projectData,
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        taskCount: 0,
        completedTasks: 0,
      };

      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      await saveProjects(updatedProjects);
      
      console.log('✅ Project added successfully:', newProject.name);
    } catch (error) {
      console.error('Error in addProject:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      const updatedProjects = projects.map(project =>
        project.id === id ? { ...project, ...updates } : project
      );
      
      setProjects(updatedProjects);
      await saveProjects(updatedProjects);
      
      console.log('✅ Project updated successfully:', id);
    } catch (error) {
      console.error('Error in updateProject:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      const updatedTasks = tasks.filter(task => task.projectId !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);

      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      await saveProjects(updatedProjects);
      
      console.log('✅ Project deleted successfully:', id);
    } catch (error) {
      console.error('Error in deleteProject:', error);
    }
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

  const refreshData = async () => {
    await loadUserData();
  };

  useEffect(() => {
    const updatedProjects = projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const completedTasks = projectTasks.filter(task => task.completed).length;
      return {
        ...project,
        taskCount: projectTasks.length,
        completedTasks,
      };
    });
    
    const hasChanges = updatedProjects.some((project, index) => {
      const original = projects[index];
      return original && (
        original.taskCount !== project.taskCount || 
        original.completedTasks !== project.completedTasks
      );
    });
    
    if (hasChanges) {
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
    }
  }, [tasks]);

  const value: TaskContextType = {
    tasks,
    projects,
    filterOptions,
    viewMode,
    loading,
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
    refreshData,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};