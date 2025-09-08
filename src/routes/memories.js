const express = require('express');
const {
  getMemories,
  getMemory,
  createMemory,
  updateMemory,
  deleteMemory,
} = require('../controllers/memoryController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getMemories)
  .post(createMemory);

router.route('/:id')
  .get(getMemory)
  .put(updateMemory)
  .delete(deleteMemory);

module.exports = router;
