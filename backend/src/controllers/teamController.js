const Team = require('../models/Team');
const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTeam = async (req, res) => {
  const { name, description, lead, members } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can create teams' });
    }

    const team = new Team({
      name,
      description,
      lead: lead || req.user._id,
      members: members || [],
      createdBy: req.user._id,
    });

    const savedTeam = await team.save();
    const populated = await Team.findById(savedTeam._id)
      .populate('lead', 'name email role')
      .populate('members', 'name email role')
      .populate('createdBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    let teams;
    if (req.user.role === 'admin') {
      teams = await Team.find({ createdBy: req.user._id })
        .populate('lead', 'name email role')
        .populate('members', 'name email role');
    } else {
      teams = await Team.find({ members: req.user._id })
        .populate('lead', 'name email role')
        .populate('members', 'name email role');
    }
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('lead', 'name email role')
      .populate('members', 'name email role');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  const { name, description, lead, members } = req.body;

  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can edit teams' });
    }

    if (name) team.name = name;
    if (description !== undefined) team.description = description;
    if (lead) team.lead = lead;
    if (members) team.members = members;

    await team.save();

    const populated = await Team.findById(team._id)
      .populate('lead', 'name email role')
      .populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team', error: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can delete teams' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error: error.message });
  }
};

exports.addTeamMember = async (req, res) => {
  const { userId } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can manage team members' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.members.map(m => m.toString()).includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    team.members.push(userId);
    await team.save();

    const populated = await Team.findById(team._id)
      .populate('lead', 'name email role')
      .populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

exports.removeTeamMember = async (req, res) => {
  const { userId } = req.body;

  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can manage team members' });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.members = team.members.filter(m => m.toString() !== userId);
    await team.save();

    const populated = await Team.findById(team._id)
      .populate('lead', 'name email role')
      .populate('members', 'name email role');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
};

exports.getWorkloadOverview = async (req, res) => {
  try {
    const teams = await Team.find(
      req.user.role === 'admin' ? { createdBy: req.user._id } : { members: req.user._id }
    ).populate('members', 'name email role').populate('lead', 'name email role');

    const allMemberIds = new Set();
    teams.forEach(team => {
      team.members.forEach(m => allMemberIds.add(m._id.toString()));
      if (team.lead) allMemberIds.add(team.lead._id.toString());
    });

    const memberIdArray = Array.from(allMemberIds);

    const tasks = await Task.find({
      assignedTo: { $in: memberIdArray },
      status: { $ne: 'Done' }
    }).populate('assignedTo', 'name email').populate('project', 'name');

    const workloadMap = {};
    memberIdArray.forEach(id => {
      workloadMap[id] = { activeTasks: 0, tasks: [] };
    });

    tasks.forEach(task => {
      if (task.assignedTo) {
        const id = task.assignedTo._id.toString();
        if (workloadMap[id]) {
          workloadMap[id].activeTasks++;
          workloadMap[id].tasks.push({
            _id: task._id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            project: task.project?.name || 'Unknown',
          });
        }
      }
    });

    const teamsWithWorkload = teams.map(team => {
      const teamObj = team.toObject();
      teamObj.members = teamObj.members.map(member => ({
        ...member,
        workload: workloadMap[member._id.toString()] || { activeTasks: 0, tasks: [] },
      }));
      if (teamObj.lead) {
        teamObj.lead = {
          ...teamObj.lead,
          workload: workloadMap[teamObj.lead._id.toString()] || { activeTasks: 0, tasks: [] },
        };
      }
      return teamObj;
    });

    res.json(teamsWithWorkload);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workload', error: error.message });
  }
};
