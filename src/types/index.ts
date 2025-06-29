export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  projectId: string;
  tags: string[];
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  completedTasks: number;
}

export interface FilterOptions {
  search: string;
  priority: 'all' | 'low' | 'medium' | 'high';
  project: string;
  status: 'all' | 'pending' | 'completed';
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      dueTodayReminders: boolean;
      dueTomorrowReminders: boolean;
      overdueReminders: boolean;
      weeklyDigest: boolean;
      reminderTime: string;
    };
  };
}

export type ViewMode = 'list' | 'calendar' | 'kanban' | 'dashboard';

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  color: string;
  icon: string;
  description: string;
}