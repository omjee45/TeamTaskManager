const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, project, assignedTo } = req.body;

  try {
    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    if (req.user.role !== 'admin' && !proj.members.includes(req.user._id)) {
      return res.status(401).json({ message: 'Not authorized to add task to this project' });
    }

    let taskAssignedTo = assignedTo;
    if (req.user.role !== 'admin') {
      taskAssignedTo = undefined;
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      project,
      assignedTo: taskAssignedTo,
      createdBy: req.user._id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
      req.user.role === 'admin' ||
      task.createdBy.toString() === req.user._id.toString() ||
      (task.assignedTo && task.assignedTo.toString() === req.user._id.toString())
    ) {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(401).json({ message: 'Not authorized to update this task' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};
