var express = require('express');
var router = express.Router();
var subscriptions = require('../models/subscriptions.js');

router.get('/subscriptions', function(req, res) {
    subscriptions.viewSubscriptions(function(err, result) {
	if(err) {
	    res.send(err);
	}
	else {
	    res.render('subscriptions/viewSubscriptions', { 'result':result });
	}
    });
});

router.get('/subscribers', function(req, res) {
    subscriptions.viewSubscribers(function(err, result) {
	if (err) {
	    res.send(err);
	}
	else {
	    res.render('subscriptions/viewSubscribers', { 'result':result });
	}
    });
});

