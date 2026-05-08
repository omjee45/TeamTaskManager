import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProjectMembers(res.data.members);
      setProjectName(res.data.name);
    } catch (error) {
      console.error('Error fetching project details', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${projectId}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title,
        description,
        project: projectId,
        assignedTo: assignedTo || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('Medium');
      setDueDate('');
      fetchTasks();
    } catch (error) {
      alert('Error creating task or not authorized');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      alert('Not authorized to update this task');
    }
  };

  const getPriorityClasses = (p) => {
    if (p === 'High') return 'bg-error/10 text-error';
    if (p === 'Low') return 'bg-outline-variant/30 text-on-surface-variant';
    return 'bg-primary/10 text-primary';
  };

  const renderTaskCard = (task) => (
    <div key={task._id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm active:scale-[0.98] transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider uppercase ${getPriorityClasses(task.priority)}`}>
          {task.priority}
        </span>
        <select 
          value={task.status} 
          onChange={(e) => handleStatusChange(task._id, e.target.value)}
          className="text-xs bg-transparent border-none text-outline focus:ring-0 cursor-pointer pr-6"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <h3 className={`text-base font-bold text-on-surface mb-2 ${task.status === 'Done' ? 'line-through text-on-surface-variant opacity-80' : ''}`}>
        {task.title}
      </h3>
      <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center">
        {task.dueDate ? (
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="text-xs">📅</span>
            <span className="text-xs font-medium">{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        ) : <div />}
        {task.assignedTo && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary-container text-on-primary text-[10px] font-bold border border-outline-variant">
            {task.assignedTo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      <div className="flex items-center gap-4 border-b border-outline-variant pb-4">
        <Link to="/projects" className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
          &larr;
        </Link>
        <h2 className="text-2xl font-bold text-on-surface">{projectName || 'Project'} <span className="text-on-surface-variant font-normal">Tasks</span></h2>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📝</span>
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">Quick Add Task</h3>
        </div>
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            <input 
              type="text" 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="md:col-span-2 bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {user?.role === 'admin' ? (
              <select 
                value={assignedTo} 
                onChange={(e) => setAssignedTo(e.target.value)}
                className="bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="">Assign to...</option>
                {projectMembers.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            ) : (
              <div className="hidden md:block"></div>
            )}
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-background border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface-variant"
            />
            <button type="submit" className="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm">
              Add Task
            </button>
          </div>
        </form>
      </div>

      <section className="flex flex-col gap-4 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">

          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface uppercase tracking-wider">To Do</span>
                <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter(t => t.status === 'To Do').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === 'To Do').map(renderTaskCard)}
              {tasks.filter(t => t.status === 'To Do').length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-outline-variant text-center text-sm text-on-surface-variant opacity-60">No tasks</div>
              )}
            </div>
          </div>

          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface uppercase tracking-wider">In Progress</span>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter(t => t.status === 'In Progress').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === 'In Progress').map(renderTaskCard)}
              {tasks.filter(t => t.status === 'In Progress').length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-outline-variant text-center text-sm text-on-surface-variant opacity-60">No tasks</div>
              )}
            </div>
          </div>

          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface uppercase tracking-wider">Done</span>
                <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter(t => t.status === 'Done').length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === 'Done').map(renderTaskCard)}
              {tasks.filter(t => t.status === 'Done').length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-outline-variant text-center text-sm text-on-surface-variant opacity-60">No tasks</div>
              )}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default Tasks;
