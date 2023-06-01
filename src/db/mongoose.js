const mongoose = require('mongoose');

const mongodbURL = 'mongodb://127.0.0.1:27017/';
const dbName = 'task-manager';

(async () => {
  try {
    await mongoose.connect(mongodbURL + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      writeConcern: {
        w: 'majority'
      }
    });
    console.log("Connected to MongoDB");
   
    } catch (err) {
        console.log(err);
    }
})();