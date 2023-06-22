// Import the necessary modules
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// Middleware function to verify the token
const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.header('Authorization').replace('Bearer ', '') || req.cookies.authToken;

    // Verify the token
   
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    
    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
   // Check if the user exists
    if (!user) {
      throw new Error();
    }

    // Attach the user and token to the request for further use
    req.user = user;
    req.token = token;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;

// Example route using the authMiddleware
// router.get('/protected', authMiddleware, (req, res) => {
//   // Access the authenticated user via req.user
//   console.log(req.user);
//   res.send('Access granted to protected route');
// });
