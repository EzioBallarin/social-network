var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); // parses POST data to the routes
var cookieParser = require('cookie-parser'); // parses cookie data in requests
var session = require('express-session'); // session data for login/logout


// Routes
var index = require('./routes/index');
var account = require('./routes/account');
var subscriptions = require('./routes/subscriptions');
var content = require('./routes/content');
var search = require('./routes/search');
var feed = require('./routes/feed');

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
app.use('/subscriptions/', subscriptions);
app.use('/content/', content);
app.use('/search/', search);
app.use('/feed/', feed);

global.isTokenPresent = function(req) {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === 'undefined')
        return false;
    const bearer = authHeader.split(" ");
    if (typeof bearer === 'undefined')
        return false;
    else 
        return true;
}

global.validateToken = function(req, res, next) {
    if (isTokenPresent(req)) {
        const token = req.headers["authorization"].split(" ")[1];
        req.token = token;
        next(req, res);
    } else {
        res.status(403).send('Invalid token'); 
    }
};

global.validateSession = function(req, res, next) {
    var account = require('./models/account.js');
    account.getSession(req.session, function(err, result) {
        if (err) {
            console.log("couldn't validate user:", err);
            res.redirect(403, '/?loginValidation=false');
        } else {
            expiration = result[0].expiration;
            var now = Date.now() / 1000;
            if (now > expiration) {
                account.deleteSession(req.session, function(err, result) {
                    if (err) {
                        console.log("could not delete session", req.session, err);
                    }
                    res.redirect(403, '/?loginValidation=false');
                });
            } else {
                next(req, res);
            }
        }
    });
};

// End of the line error handler for URL not found
app.use(function(err, req, res, next) {
    console.log("404: ", err);
    res.status(404);
    res.send("Not found");
});

module.exports = app;
