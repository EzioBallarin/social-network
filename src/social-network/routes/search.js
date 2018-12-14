var express = require('express');
var router = express.Router();
var search = require('../models/search.js');

router.get('/', function(req, res) {
    console.log(req.body.ssusn-search_data);
    var params = {
	search_data: req.body.ssusn-search_data
    };
    console.log(params.search_data);
    search.viewAll(params, function(err, result) {
	if(err) {
	    console.log(err);
	    res.send(err);
	}
	else {
	    res.redirect('search/?search_data=', {'result':result});
	}
    });
});

module.exports = router;
