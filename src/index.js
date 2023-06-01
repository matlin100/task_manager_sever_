const express = require('express');
const usersRouter = require('./routes/users');

require('./db/mongoose')


const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/users', usersRouter);

app.listen(port, () =>{
    console.log('server is up un port: ',port)
})

