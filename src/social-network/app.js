var express = require('express');
var path = require('path');

// Routes
var index = require('./routes/index');


var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', index);

module.exports = app;
