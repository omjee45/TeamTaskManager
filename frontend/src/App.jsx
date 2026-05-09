import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Teams from './pages/Teams';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="p-8 text-center text-on-surface-variant">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="App bg-background text-on-background min-h-screen transition-colors duration-200 flex flex-col md:flex-row">
      {user && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {user && <Header setIsSidebarOpen={setIsSidebarOpen} />}
        
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/projects" 
              element={<ProtectedRoute><Projects /></ProtectedRoute>} 
            />
            <Route 
              path="/projects/:projectId/tasks" 
              element={<ProtectedRoute><Tasks /></ProtectedRoute>} 
            />
            <Route 
              path="/teams" 
              element={<ProtectedRoute><Teams /></ProtectedRoute>} 
            />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
