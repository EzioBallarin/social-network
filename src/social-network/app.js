var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // parses POST data to the routes

// Routes
var index = require('./routes/index');
var account = require('./routes/account');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Custom routes
app.use('/', index);
app.use('/account/', account);

module.exports = app;
