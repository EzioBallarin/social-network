var express = require('express');
var router = express.Router();
var search = require('../models/search.js');

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

module.exports = router;
