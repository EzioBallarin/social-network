var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var subscriptions = require('../models/subscriptions.js');

router.get('/subscriptions', function(req, res) {
    res.render('subscriptions/viewSubscriptions', req.query);
});

