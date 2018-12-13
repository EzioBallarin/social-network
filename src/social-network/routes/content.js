var env = require('dotenv');
var express = require('express');
var bcrypt = require('bcrypt');
var uuid = require('uuid/v1');
var router = express.Router();
var jwt = require('jsonwebtoken');
var sharp = require('sharp');
var Multer = require('multer');
var multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
        fileSize: 5*1024*1024
    }
});
var content = require('../models/content.js');


router.get('/', function(req, res) {
	res.renderjavascript('content/', req.query);
});

router.post('/', multer.single('image_name'), function(req, res) {
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
});

module.exports = router;
