var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var account = require('../models/account.js');

// Render an HTML page for a GET request
router.get('/register', function(req, res) {
    res.render('register/register', req.query);
});

// Endpoint for creating a new account
//
// Argument - Purpose
// ssusn_email - Email address for the new account
// ssusn_fname - First name of the user
// ssusn_lname - Last name of the user
// ssusn_password - Password for the new account
router.post('/register', function(req, res) {
   account.registerNewUser(req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/account/register?wasErr=true');
        } else {
            res.redirect('/?newAccount=true');
        }

   });
});

// Endpoint for logging in
router.post('/token', function(req, res) {

});

// Endpoint for logging out
router.delete('/token', function(req, res) {

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

module.exports = router;
