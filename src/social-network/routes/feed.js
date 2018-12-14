var express = require('express');
var router = express.Router();
var feed = require('../models/feed.js');


router.get('/', function(req, res) {
	var tokenAuth = global.isTokenPresent(req);
	if (tokenAuth){
		global.validateToken(req, res, function(req, res) {
			res.redirect('/');
		});
	} else {
		global.validateSession(req, res, function(req, res) {
            console.log("sending params to getFeed model:", req.session);
			feed.getFeed(req.session, function(err, result) {
				if (err) {
					console.log("Could not get feed:", err);
					res.redirect('/?getFeed=false');
				} else {
					res.render('feed/getFeed', {'result':result});
				}
			});
		});
	}
});



module.exports = router;
