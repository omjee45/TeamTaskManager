import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path 
    ? 'px-4 py-2 rounded-lg font-medium text-sm bg-primary-fixed-dim text-on-primary-fixed transition-all' 
    : 'px-4 py-2 rounded-lg font-medium text-sm text-on-surface-variant hover:bg-surface-container-high transition-all';

  return (
    <header className="bg-surface/85 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-margin-mobile h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 text-headline-md font-headline-md font-bold text-primary">
            <span className="text-2xl">📋</span> TaskFlow
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex gap-2">
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/projects" className={isActive('/projects')}>Projects</Link>
          </div>

          <div className="flex items-center gap-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-outline-variant">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-full border border-outline-variant">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-on-surface">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold leading-none">{user.role}</span>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="ml-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container-high transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
