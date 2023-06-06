const express = require('express');
const stringSimilarity = require('string-similarity');
const auth = require('../middleware/auth')
const multer = require('multer');
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
  

  const upload = multer({
    // dest: 'uploads/', // Remove the dest option to store the file in memory
    limits: {
      fileSize: 1000000 // 1MB file size limit
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        // Invalid file extension
        return cb(new Error('Invalid file format. Only JPG, JPEG, and PNG files are allowed.'));
      }
      cb(undefined, true);
    }
  });
  
  // Update avatar route
  router.post('/me/avatar', auth, upload.single('avatar'), async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
  
    try {
      // Save the file information to the user model
      req.user.avatar = req.file.buffer; 
      await req.user.save();
  
      res.send('File uploaded');
    } catch (error) {
      // Handle any other errors that occur
      next(error);
    }
  });
  
  // Delete avatar route
  router.delete('/me/avatar', auth, async (req, res, next) => {
    try {
      if (!req.user.avatar) {
        return res.status(404).send('Avatar not found');
      }
  
      // Remove the avatar from the user model
      req.user.avatar = undefined;
      await req.user.save();
  
      res.send('Avatar deleted');
    } catch (error) {
      // Handle any other errors that occur
      next(error);
    }
  });
  
  // Serve avatar image route
  router.get('/me/avatar', auth, async (req, res, next) => {
    try {
      if (!req.user.avatar) {
        return res.status(404).send('Avatar not found');
      }
  
      // Set the response content type to the appropriate image format
      res.set('Content-Type', 'image/png'); // Assuming the avatar is stored as a PNG image
  
      // Send the avatar image
      res.send(req.user.avatar);
    } catch (error) {
      // Handle any other errors that occur
      next(error);
    }
  });
  


  module.exports = router;