const express = require('express');
const usersRouter = require('./routes/users');
const tasksRoutre = require('./routes/tasks')


require('./db/mongoose')


const app = express();
const port = process.env.PORT || 3000


app.use(express.json())
app.use('/users', usersRouter);
app.use('/tasks', tasksRoutre);

app.listen(port, () =>{
    console.log('server is up un port: ',port)
})




  