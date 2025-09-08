const Memory = require('../models/Memory');

// Get all memories for the logged-in user
exports.getMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, data: memories });
  } catch (error) {
    next(error);
  }
};

// Get single memory by ID
exports.getMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, userId: req.user.id });
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, data: memory });
  } catch (error) {
    next(error);
  }
};

// Create new memory
exports.createMemory = async (req, res, next) => {
  try {
    const { title, description, date, mediaUrl } = req.body;
    const memory = new Memory({
      title,
      description,
      date,
      mediaUrl,
      userId: req.user.id,
    });
    await memory.save();
    res.status(201).json({ success: true, data: memory });
  } catch (error) {
    next(error);
  }
};

// Update memory
exports.updateMemory = async (req, res, next) => {
  try {
    const { title, description, date, mediaUrl } = req.body;
    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, date, mediaUrl },
      { new: true, runValidators: true }
    );
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, data: memory });
  } catch (error) {
    next(error);
  }
};

// Delete memory
exports.deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }
    res.json({ success: true, message: 'Memory deleted successfully' });
  } catch (error) {
    next(error);
  }
};
