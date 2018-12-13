var express = require('express');
var router = express.Router();
var explore = require('../models/explore.js');

router.get('/', function(req, res) {
    explore.viewAll(function(err, result) {
	if(err) {
	    console.log(err);
	    res.send(err);
	}
	else {
	    res.render('explore/search', { 'result':result });
	}
    });
});

module.exports = router;
