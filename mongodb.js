
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://matlin:Cy318209152-@cluster0.4trmm31.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

// Database Name
const dbName = 'task-manager';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  //const db = client.db(dbName);
  //const collection = db.collection('tasks');

  // the following code examples can be pasted here...

  return 'done.';
}

main();