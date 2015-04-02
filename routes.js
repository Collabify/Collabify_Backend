var express = require('express');
var router	= express.Router();
var logger  = require('./logger');

// Routes
router.route('/users/')
	.post(function (req, res, next) {
		// Add a user to the database
	});

router.route('/users/:user_id/token/')
	.post(function (req, res, next) {
		// Request a new access token
	});

router.route('/users/:user_id/')
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

router.route('/events/:event_id/')
	.get(function (req, res, next) {
		// Get current settings for the event (DJ only)
	})
	.put(function (req, res, next) {
		// Change settings for the event (DJ only)
	})
	.delete(function (req, res, next) {
		// End event (DJ only)
	});

router.route('/events/:event_id/users/')
	.post(function (req, res, next) {
		// Join event (Collabifier only)
	})
	.get(function (req, res, next) {
		// Get list of users at event (DJ only)
	});

router.route('/events/:event_id/users/:user_id/')
	.put(function (req, res, next) {
		// Change settings (Collabifier only)
		// for example, "show_name"
	})
	.delete(function (req, res, next) {
		// Leave event (Collabifier only)
	});

router.route('/events/:event_id/users/:user_id/role/')
	.put(function (req, res, next) {
		// Change user's role (DJ only)
	});

router.route('/events/:event_id/playlist/')
	.post(function (req, res, next) {
		// Add song to playlist
	})
	.get(function (req, res, next) {
		// Get all songs in the playlist in their proper order
	})
	.put(function (req, res, next) {
		// Reorder songs in the playlist (DJ/Promoted only)
	});

router.route('/events/:event_id/playlist/:song_id/')
	.delete(function (req, res, next) {
		// Remove song from playlist
	});

router.route('/events/:event_id/playlist/:song_id/votes/:user_id/')
	.put(function (req, res, next) {
		// Place vote on song
	});

// Route parameters
router.param('user_id', function (req, res, next, val) {
	req.user_id = val;
});

router.param('event_id', function (req, res, next, val) {
	req.event_id = val;
});

router.param('song_id', function (req, res, next, val) {
	req.song_id = val;
});

module.exports = router;