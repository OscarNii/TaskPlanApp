import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('taskflow-user');
    setIsAuthenticated(!!userData);
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 border border-white/20">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/80 mt-4 text-center">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
              } 
            />
            <Route 
              path="/tasks" 
              element={
                isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/calendar" 
              element={
                isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;