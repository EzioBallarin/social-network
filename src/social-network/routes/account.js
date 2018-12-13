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
                console.log("Could not register account:", err);
                res.redirect('/account/register?wasErr=true');
            } else {
                res.redirect('/?newAccount=true');
            }

       });
    });
});

// Endpoint for cookie-based authentication
router.post('/login', function(req, res) {

    account.getUser(req.body, function(err, result) {
        if (err || result.length != 1) {
            console.log("Could not login:", err);
            res.redirect('/?login=false');
        } else {
            // Compare the plantext password (first arg)
            // with the stored hash retrieved for our database
            bcrypt.compare(req.body.ssusn_password, result[0].password, function(bcryptErr, bcryptRes) {
                if (bcryptErr) {
                    console.log("Could not auth for login", req.body.ssusn_email, bcryptErr);
                    res.redirect(401, '/?login=false');
                } else if (bcryptRes == true) {
                    req.session.user = result[0].id;
                    req.session.isLogged = true;
                    // Set a cookie on the user end w/ the corresponding session ID
                    // in our DB, and give it a max age of 1h (like our tokens)
                    var params = {
                        uuid: uuid(),
                        user_id: result[0].id
                    };
                    account.createNewSession(params, function(err, result) {
                        if (err) {
                            console.log("Couldn't create session", err);
                            res.redirect(401, '/?login=false');
                        } else {
                            req.session.uuid = params.uuid;
                            res.cookie('session', params.uuid, { maxAge: 3600 * 1000}); 
                            res.redirect('/?login=true');
                        }
                    });
                } else {
                    res.redirect(401, '/?login=false');
                }
            });
        }
    });

});

// Endpoint for ending cookie-based authentication session
router.post('/logout', function(req, res) {
    account.deleteSession(req.session, function(err, result) {
        if (err) {
            console.log("could not delete session");
            res.redirect(500, '/?logout=false');
        } else {
            req.session.destroy();
            res.redirect('/?logout=true');
        }
    });
});

// Endpoint for token-based authentication
router.post('/token', function(req, res) {

    // Fetch the user's password for comparison
    account.getUser(req.body, function(err, result) {
        if (err || result.length != 1) {
            console.log("Could not generate auth token:", err);
            res.sendStatus(500);
        } else { 

            // Compare the plantext password (first arg)
            // with the stored hash retrieved for our database
            bcrypt.compare(req.body.ssusn_password, result[0].password, function(bcryptErr, bcryptRes) {
                if (bcryptErr)
                    console.log("Could not auth for token:", req.body.ssusn_email, bcryptErr);

                if (bcryptRes == true) {
                    
                    // Create a token that will expire in 1 hour
                    const token = jwt.sign(
                        { username: result[0].id }, 
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

// Endpoint for ending token-based authentication session
/*
router.delete('/token', global.validateToken, function(req, res) {
    jwt.verify(req.token, process.env.JWT_SECRET, function(err, data) {
        if (err) {
            res.status(403).send(err);
        } else {
            res.status(200).send("Token deleted");        
        }
    });
});
*/
// Endpoint for deleting an account, used for testing only
router.delete('/', function(req, res) {
    account.deleteUser(req.body, function(err, result) {
        if (err) { 
            console.log("Could not delete user:", err);
            res.sendStatus(500);
        } else
            res.sendStatus(200);
    });
});


module.exports = router;
