import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TaskProvider>
          {/* You might want to conditionally render Layout based on the route */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* Add a route for your main application content */}
            <Route path="/" element={<Layout />} />
          </Routes>
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;