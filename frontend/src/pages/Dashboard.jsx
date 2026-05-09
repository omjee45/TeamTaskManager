import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard');
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-on-surface-variant text-center">Loading dashboard...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Projects</span>
          <span className="text-2xl font-bold text-on-surface">{stats.totalProjects}</span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Active Tasks</span>
          <span className="text-2xl font-bold text-primary">{stats.todo + stats.inProgress}</span>
        </div>

        <div className="bg-error-container/20 rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-error uppercase tracking-wider mb-2">Overdue</span>
          <span className="text-2xl font-bold text-error">{stats.overdue}</span>
        </div>

        <div className="bg-primary-container/10 rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-colors duration-200">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Completed</span>
          <span className="text-2xl font-bold text-primary">{stats.done}</span>
        </div>

      </section>

      <section className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between mt-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            👥
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Team Overview</h4>
            <p className="text-xs text-on-surface-variant">Stay updated with your team's progress</p>
          </div>
        </div>
        <Link to="/projects" className="text-primary text-sm font-bold hover:underline">
          View Projects &rarr;
        </Link>
      </section>

    </main>
  );
};

export default Dashboard;
