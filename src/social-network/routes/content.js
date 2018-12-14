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
	res.renderjavascript('content/', req.query);
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


router.put('/', function(req, res) {
	global.validateSession(req, res, function(req, res) {
		var params = {
			file: req.file,
			body: req.body,
			sess: req.session
		};
		content.changePost(params, function(err, result) {
			if (err) {
				console.log("Could not access post:", err);
				res.redirect('/?changePost=false');
			} else {
				res.redirect('/?changePost=true');
			}	
		});
	});
});

module.exports = router;
