const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({ createdBy: req.user._id });
    } else {
      projects = await Project.find({ members: req.user._id });
    }

    const projectIds = projects.map(p => p._id);

    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({ project: { $in: projectIds } });
    } else {

      tasks = await Task.find({ project: { $in: projectIds }, assignedTo: req.user._id });
    }

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    
    let todo = 0, inProgress = 0, done = 0, overdue = 0;
    const now = new Date();

    tasks.forEach(task => {
      if (task.status === 'To Do') todo++;
      if (task.status === 'In Progress') inProgress++;
      if (task.status === 'Done') done++;

      if (task.dueDate && new Date(task.dueDate) < now && task.status !== 'Done') {
        overdue++;
      }
    });

    res.json({
      totalProjects,
      totalTasks,
      todo,
      inProgress,
      done,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
