// npm install --save express body-parser mongoose passport bcrypt-nodejs jsonwebtoken passport-jwt

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRouter = require('./apiRouter');
const configMain = require('./config/main');

const app = express();

// Connect mongoose to handle promises
mongoose.Promise = global.Promise;

// Database Setup
mongoose.connection.openUri(configMain.database);

// Setup middleware for all Express requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup router
apiRouter(app);

// Start the server
let server = app.listen(configMain.port);
console.log('The server is listening at port ' + configMain.port + ".");