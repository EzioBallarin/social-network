var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var register = require('../models/register.js');

router.get('/', function(req, res) {
    res.render('register/register', req.query);
});

router.post('/new', function(req, res) {
   register.registerNewUser(req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/register?wasErr=true');
        } else {
            res.redirect('/?newAccount=true');
        }

   });
});

module.exports = router;
