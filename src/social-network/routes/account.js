var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var account = require('../models/account.js');

const hashRounds = 10;

// Render an HTML page for a GET request
router.get('/register', function(req, res) {
    res.render('account/register', req.query);
});

// Endpoint for creating a new account
//
// Argument - Purpose
// ssusn_email - Email address for the new account
// ssusn_fname - First name of the user
// ssusn_lname - Last name of the user
// ssusn_password - Password for the new account
router.post('/register', function(req, res) {

    // Hash the POST'd password by creating a salt after going
    // through hashRounds rounds of salt creation,
    // then continuting to add the data to the account table
    bcrypt.hash(req.body.ssusn_password, hashRounds, function (err, bcryptedPass) {
       req.body.ssusn_password = bcryptedPass;
       account.registerNewUser(req.body, function(err, result) {
            if (err) {
                console.log(err);
                res.redirect('/account/register?wasErr=true');
            } else {
                res.redirect('/?newAccount=true');
            }

       });
    });
});

// Endpoint for cookie-based authentication
router.post('/login', function(req, res) {

});

// Endpoint for token-based authentication
router.post('/token', function(req, res) {

    // Fetch the user's password for comparison
    account.getUser(req.body, function(err, result) {
        console.log("result of password fetch: ", result);
        if (err || result.length != 1) {
            console.log(err);
            res.sendStatus(500);
        } else { 

            // Compare the plaintext POST'd ssusn_password
            // with the already encrypted database entry
            bcrypt.compare(req.body.ssusn_password, result[0].password, function(bcryptErr, bcryptRes) {
                if (bcryptErr)
                    console.log("Could not auth ", req.body.ssusn_email, bcryptErr);

                if (bcryptRes == true) {
                    
                    // Create a token that will expire in 1 hour
                    const token = jwt.sign(
                        { username: req.body.ssusn_email }, 
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    res.status(200).send(token);

                } else {
                    res.status(401).send('Invalid credentials');
                }
            });
        }
    });
});

// Endpoint for ending cookie-based authentication session
router.post('/logout', function(req, res) {

});

// Endpoint for ending token-based authentication session
router.delete('/token', validateToken, function(req, res) {
    jwt.verify(req.token, process.env.JWT_SECRET, function(err, data) {
        if (err) {
            res.status(403).send(err);
        } else {
                
        }
    });
});

// Endpoint for deleting an account, used for testing only
router.delete('/', function(req, res) {
    account.deleteUser(req.body, function(err, result) {
        if (err) { 
            console.log(err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});

function validateToken(req, res, next) {
    const authHeader = req.headers["authroization"];
    if (typeof bearer !== 'undefined') {
        const bearer = authHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        res.status(403).send('Invalid token'); 
    }
}

module.exports = router;
