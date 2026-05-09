const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  getWorkloadOverview,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTeams).post(protect, createTeam);
router.route('/workload').get(protect, getWorkloadOverview);
router.route('/:id').get(protect, getTeamById).put(protect, updateTeam).delete(protect, deleteTeam);
router.route('/:id/members').post(protect, addTeamMember);
router.route('/:id/members/remove').put(protect, removeTeamMember);

module.exports = router;
