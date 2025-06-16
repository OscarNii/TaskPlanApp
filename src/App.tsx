import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Layout />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;