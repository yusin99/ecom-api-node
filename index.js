const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dbConnection = require('./config/db-connection');
const { errorHandler, notFound } = require('./middlewares/error-handler');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/auth-routes')

dbConnection();
// Middleware for parsing JSON request bodies
app.use(bodyParser.json()); // Use body-parser.json() for parsing JSON request bodies
// Middleware for parsing URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser.urlencoded() for parsing URL-encoded request bodies

app.use('/api/user', authRouter);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})