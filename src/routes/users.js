const express = require('express');
const stringSimilarity = require('string-similarity');
const User = require('../models/user');

const router = express.Router();

router.post('', async (req, res) => {
    try{
    const user = new User(req.body);
    const workt = await user.save()
    if(!workt)
        escape.send(workt)
    res.send(workt);
    }
    catch(error){
        res.status(400).send(error);
      };
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findByCredentials(email, password);
      // User credentials are valid, proceed with authentication
  
      // Send response or generate authentication token
      res.send({ user });
    } catch (error) {
      // User credentials are invalid
      res.status(401).send('Invalid credentials');
    }
  });
  

  router.get('', async (req, res) => {
    try {
      const users = await User.find({});
      const numOfUsers = await User.countDocuments({});
      res.send({ users, count: numOfUsers });
    } catch (error) {
      res.status(500).send('Error fetching users');
    }
  });
  
  router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        res.send(user);
    }catch(error){
        res.status(500).send('Error fetching user');
    };
  });

  router.patch('/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const correctedUpdates = updates.map((update) => {
      const similarity = stringSimilarity.findBestMatch(update, allowedUpdates).bestMatch;
      if (similarity.rating < 0.8) {
        return update; // If similarity rating is below a threshold, don't correct the word
      }
      return similarity.target; // Use the closest match as the corrected word
    });
    const invalidUpdates = correctedUpdates.filter((update) => !allowedUpdates.includes(update));
  
    if (invalidUpdates.length > 0) {
      return res.status(400).send(`Invalid update: ${invalidUpdates.join(', ')}`);
    }
  
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  });
    
  router.delete('', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByCredentials(email, password);
        const deleted = await User.deleteMany()
        res.send(deleted)
      } catch (error) {
        // User credentials are invalid
        res.status(401).send('Invalid credentials');
      }
})

router.delete('/:id', async (req, res) => {
    try{
    const teleted = await User.findByIdAndRemove(req.params.id)
    if(!teleted){
        res.status(404).send('not find user tu delet')
    }
    req.send(teleted)
}catch(error){
    res.send(error)
}
})

module.exports = router;