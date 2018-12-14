var express = require('express');
var router = express.Router();
var search = require('../models/search.js');
var subscribe = require('../models/subscriptions.js');

router.get('/', function(req, res) {
    console.log(req.body);
    console.log("params for search: ", req.query['search_data']);
    search.viewAll(req.query, function(err, result) {
	if(err) {
	    console.log(err);
	    res.send(err);
	}
	else {
	    res.render('search/search', {'result':result});
	}
    });
});

router.post('/subscribe', function(req, res) {
    var tokenAuth = global.isTokenPresent(req);
    if (tokenAuth){
        global.validateToken(req, res, function(req, res) {
            res.redirect('/');
        });
    } else {
        global.validateSession(req, res, function(req, res) {
            var params = {
                sess: req.session,
		subs: req.body.username
            };
            console.log("params body: ", params.subs);
            subscribe.subscribeUser(params, function(err, result) {
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
