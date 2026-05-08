const express = require('express');
const router = express.Router();
const { createProject, getProjects, addMember, getProjectById } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, admin, createProject);
router.route('/addMember').post(protect, admin, addMember);
router.route('/:id').get(protect, getProjectById);

module.exports = router;
