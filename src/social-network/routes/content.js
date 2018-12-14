var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var path = require('path');
var Multer = require('multer');
var multer = Multer({
	storage: Multer.MemoryStorage,
	fileFilter: function (req, file, callback) {
		var filetypes = /png|jpg|jpeg/;
		var mimetype = filetypes.test(file.mimetype);
		var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		if (mimetype && extname) {
			callback(null, true);
		} else {
			console.log("error, tried uploading", file);
			console.log("mimetype:", mimetype);
			console.log("extname:", extname);
			callback(new Error("File upload only supports " + filetypes));
		}
	}
});
var upload = multer.single('image_name');

var content = require('../models/content.js');


router.get('/', function(req, res) {
	res.render('content/', req.query);
});


router.get('/getPosts', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
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
					console.log("Made it here!");
					content.getUserPost(params, function(err, result) {
						if (err) {
							console.log("Could not get user posts:", err);
							res.redirect('/?getUserPost=false');
						} else {
							console.log("result of get post:", result);
							res.render('content/getPosts', {'result':result});
						}
					});
				});
			}
		}
	});
});


router.post('/', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
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
					content.createNewPost(params, function(err, result) {
						if (err) {
							console.log("Could not create post:", err);
							res.redirect('/?newPost=false');
						} else {
							res.redirect('/?newPost=true');
						}
					});
				});
			}
		}
	});
});



router.get('/:post_id', function(req, res) {
	content.getPost(req.params.post_id, function(err, result) {
		if (err) {
			console.log("Could not get post:", err);
			res.redirect('/?getPost=false');
		} else {
			res.render('content/getPost', { 'result':result});
		}
	});

});


router.post('/:post_id', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
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
						post_id: req.params.post_id,
						data: req.query
					};
					console.log("change post req query: ", req.query);
					console.log("Running changePost");
					content.changePost(params, function(err, result) {
						if (err) {
							console.log("Could not access post:", err);
							res.redirect('/?changePost=false');
						} else {
						 	res.redirect('/?changePost=true');
						}
					});
				});
			}
		}
	});
});

router.delete('/:post_id', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
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
						post_id: req.params.post_id
					};
					content.deletePost(params, function(err, result) {
						if(err) {
							console.log("Could not delete post:", err);
							res.redirect('deletePost=false');
						} else {
							res.redirect('deletePost=true');
						}
					});
				});
			}
		}
	});
});


module.exports = router;
