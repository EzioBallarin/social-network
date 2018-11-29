var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var register = require('../models/register.js');

router.get('/', function(req, res) {
    res.render('register/register');
});

router.post('/new', function(req, res) {
   console.log(req.body);
   register.registerNewUser(req.body, function(err, result) {
        if (err) {
            console.log(err);
        } /*else {
            res.render('./index');
        }*/

        res.redirect('./index');
   });
});

module.exports = router;
