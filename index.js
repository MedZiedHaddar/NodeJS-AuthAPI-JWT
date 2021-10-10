const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Connect to Database
mongoose.connect(process.env.DB_CONNECT,
() => console.log('connected to DB'));

//Middlewares
app.use(express.json()); //now we can use the parser in post reqs
app.use(express.urlencoded({extended: false}));

//Import Routes
const authRoute = require('./routes/auth'); 
const postRoute = require('./routes/posts');

//Route middleware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);


app.listen(3000, () => console.log('server up and running'));