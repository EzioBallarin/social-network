var express = require('express');
var router = express.Router();
var search = require('../models/search.js');

router.get('/', function(req, res) {
    search.viewAll(req.body.ssusn-search, function(err, result) {
	if(err) {
	    console.log(err);
	    res.send(err);
	}
	else {
	    res.render('search/search', {'result':result});
	}
    });
});

module.exports = router;
