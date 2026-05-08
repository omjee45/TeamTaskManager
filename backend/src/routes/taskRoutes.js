const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTask);
router.route('/:projectId').get(protect, getTasks);
router.route('/:id/status').put(protect, updateTaskStatus);

module.exports = router;
