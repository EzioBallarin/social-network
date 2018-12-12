var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sharp = require('sharp');
var content = require('../models/content.js');

router.get('/', function(req, res) {
	res.render('content/', req.query);
});


router.post('/', function(req, res) {
    var params = {
        body: req.body,
        sess: req.session
    };
	content.createNewPost(params, function(err, result) {
		if (err) {
			console.log("Could not create post:", err);
			res.redirect('/content/?wasErr=true');
		} else {
			res.redirect('/?newPost=true');
		}
	});
});

module.exports = router;
