import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
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