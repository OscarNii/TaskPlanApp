import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Project, FilterOptions, ViewMode } from '../types';
import { supabase } from '../lib/supabase';
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

  // Load data when user changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadUserData();
      } else {
        // Clear data when user logs out
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

  const loadProjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading projects:', error);
        return;
      }

      // Transform database projects to app format
      const transformedProjects = data.map(project => ({
        id: project.id,
        name: project.name,
        color: project.color,
        taskCount: 0, // Will be calculated when tasks are loaded
        completedTasks: 0, // Will be calculated when tasks are loaded
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error in loadProjects:', error);
    }
  };

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        return;
      }

      // Transform database tasks to app format
      const transformedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        projectId: task.project_id,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error in loadTasks:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          project_id: taskData.projectId,
          title: taskData.title,
          description: taskData.description,
          completed: taskData.completed,
          priority: taskData.priority,
          due_date: taskData.dueDate?.toISOString(),
          tags: taskData.tags,
          subtasks: taskData.subtasks,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
        return;
      }

      // Transform and add to local state
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        priority: data.priority,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        projectId: data.project_id,
        tags: data.tags || [],
        subtasks: data.subtasks || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Error in addTask:', error);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString();
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.subtasks !== undefined) updateData.subtasks = updates.subtasks;

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task:', error);
        return;
      }

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ));
    } catch (error) {
      console.error('Error in updateTask:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        return;
      }

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error in deleteTask:', error);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { completed: !task.completed });
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'taskCount' | 'completedTasks'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectData.name,
          color: projectData.color,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding project:', error);
        return;
      }

      // Transform and add to local state
      const newProject: Project = {
        id: data.id,
        name: data.name,
        color: data.color,
        taskCount: 0,
        completedTasks: 0,
      };

      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('Error in addProject:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating project:', error);
        return;
      }

      // Update local state
      setProjects(prev => prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      ));
    } catch (error) {
      console.error('Error in updateProject:', error);
    }
  };

  const deleteProject = async (id: string) => {
    if (!user) return;

    try {
      // Delete all tasks in this project first
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', id)
        .eq('user_id', user.id);

      if (tasksError) {
        console.error('Error deleting project tasks:', tasksError);
        return;
      }

      // Delete the project
      const { error: projectError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (projectError) {
        console.error('Error deleting project:', projectError);
        return;
      }

      // Update local state
      setProjects(prev => prev.filter(project => project.id !== id));
      setTasks(prev => prev.filter(task => task.projectId !== id));
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

  // Update project task counts when tasks change
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