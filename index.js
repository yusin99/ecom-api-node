const express = require('express');
const app = express();
const dbConnection = require('./config/db-connection');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
app.use('/', (req, res)=>{
    dbConnection();
    res.send('Main endpoint working')
})
app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})