const mongoose = require('mongoose');

const mongodbURL = 'mongodb://tasks-app:zxpuZFXrQiWlsFhc3TcoDy87M6h3SLUI5da9cPH2DOFQwO1hUkdiAhRIkn6VmQeN7rO7Xt7UZSzVACDbpHcm4A==@tasks-app.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@tasks-app@/';
const dbName = 'task-manager';

(async () => {
  try {
    await mongoose.connect(mongodbURL + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
      auth: {
        username: 'tasks-app',
        password: 'zxpuZFXrQiWlsFhc3TcoDy87M6h3SLUI5da9cPH2DOFQwO1hUkdiAhRIkn6VmQeN7rO7Xt7UZSzVACDbpHcm4A=='
      }
    });
    console.log("Connected to MongoDB");
   
  } catch (err) {
    console.log(err);
  }
})();
