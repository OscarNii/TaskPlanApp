import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout'; // Assuming Layout component exists and is your main app layout
import { TaskProvider } from './contexts/TaskContext'; // Assuming you have these context providers
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* This route will render the Layout for all other paths */}
            <Route path="*" element={<Layout />} /> 
          </Routes>
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
