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
      auth: {
        user: process.env.DB_USER_NAME,
        password: process.env.DB_PASSOWRD
      },
      writeConcern: {
        w: 'majority'
      }
    });
    console.log("Connected to MongoDB");
   
    } catch (err) {
        console.log(err);
    }
})();