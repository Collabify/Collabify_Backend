var express = require('express');
var router	= express.Router();
var logger  = require('./logger');

// Routes
router.route('/users/')
	.post(function (req, res, next) {
		// Add a user to the database
	});

router.route('/users/:userId/token/')
	.post(function (req, res, next) {
		// Request a new access token
	});

router.route('/users/:userId/')
	.delete(function (req, res, next) {
		// Log out the user and delete them from the database
	});

router.route('/events/')
	.post(function (req, res, next) {
		// Create a new event
	})
	.get(function (req, res, next) {
		// Get all events near provided coordinates
	});

router.route('/events/:eventId/')
	.get(function (req, res, next) {
		// Get current settings for the event (DJ only)
	})
	.put(function (req, res, next) {
		// Change settings for the event (DJ only)
	})
	.delete(function (req, res, next) {
		// End event (DJ only)
	});

router.route('/events/:eventId/users/')
	.post(function (req, res, next) {
		// Join event (Collabifier only)
	})
	.get(function (req, res, next) {
		// Get list of users at event (DJ only)
	});

router.route('/events/:eventId/users/:userId/')
	.put(function (req, res, next) {
		// Change settings (Collabifier only)
		// for example, "show_name"
	})
	.delete(function (req, res, next) {
		// Leave event (Collabifier only)
	});

router.route('/events/:eventId/users/:userId/role/')
	.put(function (req, res, next) {
		// Change user's role (DJ only)
	});

router.route('/events/:eventId/playlist/')
	.post(function (req, res, next) {
		// Add song to playlist
	})
	.get(function (req, res, next) {
		// Get all songs in the playlist in their proper order
	})
	.put(function (req, res, next) {
		// Reorder songs in the playlist (DJ/Promoted only)
	});

router.route('/events/:eventId/playlist/:songId/')
	.delete(function (req, res, next) {
		// Remove song from playlist
	});

router.route('/events/:eventId/playlist/:songId/votes/:userId/')
	.put(function (req, res, next) {
		// Place vote on song
	});

// Route parameters
router.param('userId', function (req, res, next, val) {
	req.userId = val;
	next();
});

router.param('eventId', function (req, res, next, val) {
	req.eventId = val;
	next();
});

router.param('songId', function (req, res, next, val) {
	req.songId = val;
	next();
});

module.exports = router;