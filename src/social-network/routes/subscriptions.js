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
            subscriptions.viewSubscriptions(req.session.user, function(err, result) {
                if(err) {
                    res.send(err);
                }
                else {
                    res.render(
                        'subscriptions/viewSubscriptions', 
                        { 'result':result }
                    );
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
	        subscriptions.viewSubscribers(req.session.user, function(err, result) {
		    if (err) {
		        res.status(500).send(err);
		    }
		    else {
		        res.render(
                    'subscriptions/viewSubscribers', 
                    { 'user_id':result }
                );
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
                body: req.body,
                sess: req.session,
		        subs: req.query
            };
            console.log("params body for POST /subscriptions: ", params.body);
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
