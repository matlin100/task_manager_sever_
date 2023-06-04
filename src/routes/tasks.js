const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');
const User = require('../models/user')

const router = express.Router();

// Create a task
router.post('', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a task
router.patch('/:taskId', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'completed'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({ owner: req.user._id, _id: req.params.taskId });

    
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id
      });
  
      if (!task) {
        return res.status(404).send();
      }
  
      res.send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
// Delete all tasks of an owner
router.delete('', auth, async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user._id });
    res.send('All tasks deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read all tasks of an owner
router.get('', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, description, color, completed, isPublic, createdBefore, createdAfter, updatedBefore, updatedAfter, sortBy, sortOrder } = req.query;
      const { page = 1, limit = 10 } = req.query;
  
      const filters = { owner: userId };
      if (title) filters.title = { $regex: title, $options: 'i' };
      if (description) filters.description = { $regex: description, $options: 'i' };
      if (color) filters.color = color;
      if (completed) filters.completed = completed === 'true';
      if (isPublic) filters.isPublic = isPublic === 'true';
  
      if (createdBefore) filters.createdAt = { $lt: new Date(createdBefore) };
      if (createdAfter) filters.createdAt = { $gt: new Date(createdAfter) };
      if (updatedBefore) filters.updatedAt = { $lt: new Date(updatedBefore) };
      if (updatedAfter) filters.updatedAt = { $gt: new Date(updatedAfter) };
  
      const sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      }
  
      const user = await User.findById(userId).populate({
        path: 'tasks',
        match: filters,
        options: {
          skip: (page - 1) * limit,
          limit: limit,
          sort: sortOptions
        }
      }).exec();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const totalTasks = user.tasks.length;
      const totalPages = Math.ceil(totalTasks / limit);
  
      res.send({
        tasks: user.tasks,
        page,
        totalPages,
        totalTasks
      });
    } catch (error) {
      res.status(500).send('Error fetching user tasks');
    }
  });
  
  
  
  router.get('/search', auth, async (req, res) => {
    const { title, description, completed } = req.query;
    const match = {};
  
    if (title) {
      match.title = { $regex: title, $options: 'i' };
    }
  
    if (description) {
      match.description = { $regex: description, $options: 'i' };
    }
  
    if (completed) {
      match.completed = (completed === 'true');
    }
  
    try {
      const tasks = await Task.find({ owner: req.user._id, ...match });
      res.send(tasks);
    } catch (error) {
      res.status(500).send(error);
    }
  });


  router.get('/:taskId', auth, async (req, res) => {
    try {
      const userId = req.user.id;
      const taskId = req.params.taskId;

      const user = await User.findById(userId).populate({
        path: 'tasks',
        match: { _id: taskId }
      }).exec();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const task = user.tasks.find(task => task._id.toString() === taskId);
      if (!task) {
        return res.status(404).send('Task not found');
      }
  
      res.send(task);
    } catch (error) {
      res.status(500).send('Error fetching task');
    }
  });
    
  
  

module.exports = router;
