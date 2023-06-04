const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/task');

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
router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({owner: req.user._id});
    
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
router.delete('/me', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
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
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
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
  

module.exports = router;
