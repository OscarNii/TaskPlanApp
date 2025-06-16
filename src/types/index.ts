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

export type ViewMode = 'list' | 'calendar' | 'kanban';