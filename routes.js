var express = require('express');
var router	= express.Router();

// main routes
router.get('/', function(req, res, next) {
	res.send('Hello from Root');
});

// user routes
router.get('/users/', function(req, res, next) {
	res.send('log users');
});

module.exports = router;