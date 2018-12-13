var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sharp = require('sharp');
var content = require('../models/content.js');


router.get('/', function(req, res) {
	res.render('content/content');
});


router.post('/', function(req, res) {
	content.createNewPost(req.body, function(err, result) {
		if(err){
			console.log(err);
			res.redirect('/content/?wasErr=true');
		} else {
			res.render('content/createPost', {'post_id':result} );
		}
	});
});


router.put('/:post_id', function(req, res) {
	content.changePost(req.body, function(err, result) {
		if(err){
			console.log(err);
			res.redirect('content/?wasErr=true');
		} else {
			res.redirect('/?changePost=true');
		}
	});
});


router.delete('/:post_id', function(req, res) {
	content.deletePost(req.body, function(err, result) {
		if(err){
			console.log(err);
			res.redirect('content/?wasErr=true');
		} else {
			res.redirect('/?deletePost=true');
		}
	});
});

module.exports = router;
