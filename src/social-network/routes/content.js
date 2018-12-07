var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var content = require('../models/content.js');

router.get('/create', function(req, res) {
	res.render('content/create', req.query);
});


router.post('/create', function(req, res) {
	content.createNewPost(req.body, function(err, result) {
		if(err){
			console.log(err);
			res.redirect('/content/create?wasErr=true');
		} else {
			res.redirect('/?newPost=true');
		}
	});
});
