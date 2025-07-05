import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  settings: any;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users database
const MOCK_USERS = [
  {
    id: 'demo-user-1',
    email: 'demo@taskflow.com',
    password: 'demo123',
    name: 'Demo User'
  },
  {
    id: 'user-1',
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('taskflow-user');
      const savedProfile = await AsyncStorage.getItem('taskflow-profile');
      
      if (savedUser && savedProfile) {
        const userData = JSON.parse(savedUser);
        const profileData = JSON.parse(savedProfile);
        
        setUser(userData);
        setProfile(profileData);
        setSession({ user: userData });
        console.log('✅ Restored user session:', userData.email);
      }
    } catch (error) {
      console.error('Error restoring session:', error);
      await AsyncStorage.multiRemove(['taskflow-user', 'taskflow-profile']);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = (user: User): Profile => {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        return { error: { message: 'User already exists with this email' } };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
      };

      MOCK_USERS.push({
        id: newUser.id,
        email,
        password,
        name,
      });

      const newProfile = createProfile(newUser);

      await AsyncStorage.setItem('taskflow-user', JSON.stringify(newUser));
      await AsyncStorage.setItem('taskflow-profile', JSON.stringify(newProfile));

      setUser(newUser);
      setProfile(newProfile);
      setSession({ user: newUser });

      console.log('✅ User signed up successfully:', email);
      return { error: null };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: { message: 'Failed to create account' } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        return { error: { message: 'Invalid email or password' } };
      }

      const user: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      };

      const profile = createProfile(user);

      await AsyncStorage.setItem('taskflow-user', JSON.stringify(user));
      await AsyncStorage.setItem('taskflow-profile', JSON.stringify(profile));

      setUser(user);
      setProfile(profile);
      setSession({ user });

      console.log('✅ User signed in successfully:', email);
      return { error: null };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: { message: 'Failed to sign in' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['taskflow-user', 'taskflow-profile']);
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user || !profile) {
        return { error: new Error('No user logged in') };
      }

      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await AsyncStorage.setItem('taskflow-profile', JSON.stringify(updatedProfile));
      
      setProfile(updatedProfile);
      
      console.log('✅ Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};