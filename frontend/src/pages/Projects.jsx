import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addMemberData, setAddMemberData] = useState({ projectId: '', userId: '' });
  const [showAddMember, setShowAddMember] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setAllUsers(res.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      alert('Error creating project');
    }
  };

  const handleAddMember = async (projectId) => {
    if (!addMemberData.userId) return alert('Please select a user');
    try {
      await api.post('/projects/addMember', { projectId, userId: addMemberData.userId });
      setShowAddMember(null);
      setAddMemberData({ projectId: '', userId: '' });
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding member');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-on-surface">Projects</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage your team projects and members</p>
      </div>

      {user.role === 'admin' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">➕</span>
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Create New Project</h3>
          </div>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Project Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="flex-1 bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="flex-[2] bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <button type="submit" className="bg-primary text-on-primary rounded-lg px-6 py-2 text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
              Create
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.length === 0 ? (
          <div className="col-span-full text-center p-12 text-on-surface-variant opacity-60">
            <span className="text-4xl block mb-2">📂</span>
            <p>No projects found.</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project._id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col gap-4 transition-colors duration-200 hover:shadow-md">
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-1">{project.name}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">{project.description}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  👥 {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                </span>
                {project.members.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.members.map(m => (
                      <span key={m._id} className="bg-primary-fixed-dim text-on-primary-fixed px-2 py-1 rounded-full text-xs font-medium">
                        {m.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {user.role === 'admin' && (
                <div className="pt-3 border-t border-outline-variant mt-2">
                  {showAddMember === project._id ? (
                    <div className="flex flex-col gap-3">
                      <select 
                        value={addMemberData.userId}
                        onChange={(e) => setAddMemberData({ ...addMemberData, userId: e.target.value })}
                        className="bg-background border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:border-primary outline-none"
                      >
                        <option value="">Select a user...</option>
                        {allUsers
                          .filter(u => !project.members.find(m => m._id === u._id) && u._id !== user._id)
                          .map(u => (
                            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                          ))
                        }
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddMember(project._id)} className="bg-primary text-on-primary rounded-lg px-3 py-1.5 text-xs font-bold hover:opacity-90">Add</button>
                        <button onClick={() => setShowAddMember(null)} className="border border-outline-variant text-on-surface-variant rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-surface-container-high">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddMember(project._id)} className="border border-outline-variant text-on-surface-variant rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-surface-container-high transition-colors">
                      + Add Member
                    </button>
                  )}
                </div>
              )}

              <div className="mt-auto pt-2">
                <Link to={`/projects/${project._id}/tasks`} className="inline-block bg-surface-container-high text-on-surface rounded-lg px-4 py-2 text-sm font-bold hover:bg-outline-variant transition-colors">
                  View Tasks &rarr;
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Projects;
