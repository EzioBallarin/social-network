var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	res.render('index', {query: req, session: req.session});
});

module.exports = router;
