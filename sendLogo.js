const multer = require('multer');
const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();

// Multer configuration for file upload
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      // Invalid file extension
      req.fileValidationError = 'Invalid file format. Only JPG, JPEG, and PNG files are allowed.';
      return cb(null, false);
    }
    cb(null, true);
  }
});


const username = 'tasks-app';
const primaryPassword = 'zxpuZFXrQiWlsFhc3TcoDy87M6h3SLUI5da9cPH2DOFQwO1hUkdiAhRIkn6VmQeN7rO7Xt7UZSzVACDbpHcm4A==';
const host = 'tasks-app.mongo.cosmos.azure.com';
const port = 10255;
const dbName = 'task-manager';
const collectionName = 'logo';

const mongodbURL = `mongodb://${username}:${primaryPassword}@${host}:${port}/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@tasks-app@`;

(async () => {
  try {
    const client = await MongoClient.connect(mongodbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db('test');
    console.log('Connected to MongoDB');

    // Create the collection if it doesn't exist
    const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
    if (!collectionExists) {
      await db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created`);
    }

    // Express routes
    app.post('/upload', upload.single('image'), async (req, res) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
    
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
    
      const imagePath = req.file.buffer;
    
      try {
        // Insert the image into the database collection
        const collection = await db.collection('logo');
        await collection.insertOne({ imagePath });
        console.log('Image inserted into the database');
        res.send('Image uploaded and inserted into the database');
      } catch (err) {
        console.error('Error inserting image into the database:', err);
        res.status(500).send('Error inserting image into the database');
      }
    });
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
