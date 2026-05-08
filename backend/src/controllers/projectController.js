const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = new Project({
      name,
      description,
      createdBy: req.user._id,
      members: members || [],
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({ createdBy: req.user._id }).populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

exports.addMember = async (req, res) => {
  const { projectId, userId } = req.body;

  try {
    const project = await Project.findById(projectId);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};
