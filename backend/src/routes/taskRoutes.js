const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, getAllUserTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTask);
router.route('/user/all').get(protect, getAllUserTasks);
router.route('/:projectId').get(protect, getTasks);
router.route('/:id/status').put(protect, updateTaskStatus);

module.exports = router;
