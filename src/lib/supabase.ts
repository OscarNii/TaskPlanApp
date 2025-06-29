// This file is kept for type definitions but Supabase functionality is removed

// Database types for reference
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          timezone: string;
          language: string;
          settings: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          timezone?: string;
          language?: string;
          settings?: any;
        };
        Update: {
          email?: string;
          name?: string;
          avatar_url?: string;
          timezone?: string;
          language?: string;
          settings?: any;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          color?: string;
        };
        Update: {
          name?: string;
          color?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          title: string;
          description: string;
          completed: boolean;
          priority: 'low' | 'medium' | 'high';
          due_date?: string;
          tags: string[];
          subtasks: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          project_id: string;
          title: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          tags?: string[];
          subtasks?: any[];
        };
        Update: {
          title?: string;
          description?: string;
          completed?: boolean;
          priority?: 'low' | 'medium' | 'high';
          due_date?: string;
          tags?: string[];
          subtasks?: any[];
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];