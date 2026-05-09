import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Header = ({ setIsSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const location = useLocation();

  if (!user) return null;

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths[0] === 'dashboard') {
      return <h1 className="text-lg font-bold text-on-surface">Dashboard</h1>;
    }
    if (paths[0] === 'projects') {
      if (paths.length > 1) {
        return (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-bold text-on-surface">Tasks</span>
          </div>
        );
      }
      return <h1 className="text-lg font-bold text-on-surface">Projects</h1>;
    }
    if (paths[0] === 'teams') {
      return <h1 className="text-lg font-bold text-on-surface">Teams</h1>;
    }
    return <h1 className="text-lg font-bold text-on-surface">TaskFlow</h1>;
  };

  return (
    <header className="h-16 bg-surface/85 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-200">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant md:hidden"
          title="Open Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {getBreadcrumbs()}
      </div>

      <div className="flex items-center gap-4">
        
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-xl bg-surface-container text-on-surface-variant hover:text-primary transition-all duration-200 shadow-sm"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-amber-500 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.16 5.1a.75.75 0 011.06 0l1.59 1.59a.75.75 0 11-1.06 1.06L6.16 6.16a.75.75 0 010-1.06zm11.68 0a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 11-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM12 6a6 6 0 100 12 6 6 0 000-12zm-8.25 6a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zm13.5 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM6.16 18.84a.75.75 0 010-1.06l1.59-1.59a.75.75 0 111.06 1.06l-1.59 1.59a.75.75 0 01-1.06 0zm11.68 0a.75.75 0 01-1.06 0l-1.59-1.59a.75.75 0 111.06-1.06l1.59 1.59a.75.75 0 010 1.06zM12 17.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V18a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 11-16.949-11.84.75.75 0 01.833.268z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-xs font-bold shadow-sm" title={`${user.name} (${user.role})`}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
