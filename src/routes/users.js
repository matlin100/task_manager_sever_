const express = require('express');
const stringSimilarity = require('string-similarity');
const auth = require('../middleware/auth')
const User = require('../models/user')
const Task = require('../models/task')

const router = express.Router();

router.post('', async (req, res) => {
    try{
    const user = new User(req.body);
    await user.generateAuthToken()
    res.send(user.tokens);
    }
    catch(error){
        res.status(400).send(error);
      };
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const {user} = await User.findByCredentials(email, password);
      res.send(user);
    } catch (error) {
      // User credentials are invalid
      res.status(401).send('Invalid credentials');
    }
  });


  router.post('/logout', auth, async (req, res) => {
    try {
      // Remove the token from the user's token array
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
      // Save the updated user document
      await req.user.save();
      res.send('Logout successful');
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Logout route
router.post('/logoutAll', auth, async (req, res) => {
  try {
    // Remove all tokens from the user's token array
    req.user.tokens = [];
    // Save the updated user document
    await req.user.save();
    res.send('Logout from all devices successful');
  } catch (error) {
    res.status(500).send(error);
  }
});

  
  router.get('/me', auth, async (req, res) => {
    try{
        res.send(req.user);
    }catch(error){
        res.status(500).send('Error fetching user');
    };
  });


  router.delete('/me', auth, async (req, res) => {
    console.log('in delet')
    try {
      const userId = req.user._id;
   
      // Delete all tasks associated with the user
      await Task.deleteMany({ owner: userId });
      
      // Delete the user
      const deletedUser = await User.findByIdAndRemove(userId);
  
      if (!deletedUser) {
        return res.status(404).send('User not found');
      }
      console.log(deletedUser)
      res.send(deletedUser);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
module.exports = router;