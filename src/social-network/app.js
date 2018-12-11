var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // parses POST data to the routes
var cookieParser = require('cookie-parser'); // parses cookie data in requests
var session = require('express-session'); // session data for login/logout


// Routes
var index = require('./routes/index');
var account = require('./routes/account');
var content = require('./routes/content');
=======
var subscriptions = require('./routes/subscriptions');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Enable cookie parsing
app.use(cookieParser());

// Initialize session to track logged in users
app.use(session({
    key: 'ssusn_usersid',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600 * 1000 }
}));

// Clear the session cookie if it already exists,
// but the user is not logged in.
// Since no path was supplied, this function is run
// on EVERY request received
app.use( (req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) 
        res.clearCookie('ssusn_usersid');
    next();
});

// Custom routes
app.use('/', index);
app.use('/account/', account);
app.use('/content/', content);
app.use('/subscriptions/', subscriptions);

global.validateToken = function(req, res, next) {
    const authHeader = req.headers["authroization"];
    if (typeof bearer !== 'undefined') {
        const bearer = authHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.status(403).send('Invalid token'); 
    }
};

module.exports = app;
