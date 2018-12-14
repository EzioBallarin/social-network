var express = require('express');
var router = express.Router();
var subscriptions = require('../models/subscriptions.js');

router.get('/', function(req, res) {
    var tokenAuth = global.isTokenPresent(req);
    if (tokenAuth){
	global.validateToken(req, res, function(req, res) {
            res.redirect('/');
	});
    } else {
	global.validateSession(req, res, function(req, res) {
            var params = {
		file: req.file,
		body: req.body,
		sess: req.session
            };
	    console.log("params body: ", params.body);
	    subscriptions.viewSubscriptions(params, function(err, result) {
		if(err) {
		    res.send(err);
		}
		else {
		    //var user_id = jwt.verify(token, process.env.JWT_SECRET);
		    res.render('subscriptions/viewSubscriptions', { 'result':result });
		}
	    });
	});
    }
});

router.get('/subscribers', function(req, res) {
    var tokenAuth = global.isTokenPresent(req);
    if (tokenAuth){
        global.validateToken(req, res, function(req, res) {
            res.redirect('/');
        });
    } else {
        global.validateSession(req, res, function(req, res) {
            var params = {
                file: req.file,
                body: req.body,
                sess: req.session
            };
            console.log("params body: ", params.body);
	    subscriptions.viewSubscribers(params, function(err, result) {
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
    }
});

router.post('/', function(req, res) {
    var tokenAuth = global.isTokenPresent(req);
    if (tokenAuth){
        global.validateToken(req, res, function(req, res) {
            res.redirect('/');
        });
    } else {
        global.validateSession(req, res, function(req, res) {
            var params = {
                file: req.file,
                body: req.body,
                sess: req.session,
		subs: req.query
            };
            console.log("params body: ", params.body);
	    subscriptions.subscribeUser(params, function(err, result) {
		if (err) {
		    res.send(err);
		}
		else {
		    res.send("succesfully subscribed!");
		}
	    });
	});
    }
});

module.exports = router;
