const mongoose = require('mongoose');

const mongodbURL = process.env.MONGODB_URL;
const dbName = 'task-manager';

(async () => {
  try {
    await mongoose.connect(mongodbURL + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
      writeConcern: {
        w: 'majority'
      }
    });
    console.log("Connected to MongoDB");
   
    } catch (err) {
        console.log(err);
    }
})();