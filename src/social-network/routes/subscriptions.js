var express = require('express');
var router = express.Router();
var subscriptions = require('../models/subscriptions.js');

router.get('/', function(req, res) {
    subscriptions.viewSubscriptions(0, function(err, result) {
	if(err) {
	    res.send(err);
	}
	else {
	    //var user_id = jwt.verify(token, process.env.JWT_SECRET);
	    res.render('subscriptions/viewSubscriptions', { 'user_id':result });
	}
    });
});

router.get('/subscribers', function(req, res) {
    subscriptions.viewSubscribers(0, function(err, result) {
	if (err) {
	    res.send(err);
	}
	else {
	    //validateToken(req, res, next);
	    //var user_id = jwt.verify(token, process.env.JWT_SECRET);
	    res.render('subscriptions/viewSubscribers', { 'user_id':result });
	}
    });
});

module.exports = router;
