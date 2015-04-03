var express		= require('express');
var router		= express.Router();
var logger		= require('./logger');
var mocks		= require('./mocks');

// Routes
router.route('/users/')
	.post(function (req, res, next) {
		// Add a user to the database
		res.send('POST ' + req.path);
	});

router.route('/users/:userId/token/')
	.post(function (req, res, next) {
		// Request a new access token
		res.send('POST ' + req.path);
	});

router.route('/users/:userId/')
	.delete(function (req, res, next) {
		// Log out the user and delete them from the database
		res.send('DELETE ' + req.path);
	});

router.route('/events/')
	.post(function (req, res, next) {
		// Create a new event
		res.send('POST ' + req.path);
	})
	.get(function (req, res, next) {
		// Get all events near provided coordinates
		res.send(mocks.events);
	});

router.route('/events/:eventId/')
	.get(function (req, res, next) {
		// Get current settings for the event (DJ only)
		res.send(mocks.events[0].settings);
	})
	.put(function (req, res, next) {
		// Change settings for the event (DJ only)
		res.send('PUT ' + req.path);
	})
	.delete(function (req, res, next) {
		// End event (DJ only)
		res.send('DELETE ' + req.path);
	});

router.route('/events/:eventId/users/')
	.post(function (req, res, next) {
		// Join event (Collabifier only)
		res.send('POST ' + req.path);
	})
	.get(function (req, res, next) {
		// Get list of users at event (DJ only)
		res.send(mocks.events[0].users);
	});

router.route('/events/:eventId/users/:userId/')
	.put(function (req, res, next) {
		// Change settings (Collabifier only)
		res.send('PUT ' + req.path);
	})
	.delete(function (req, res, next) {
		// Leave event (Collabifier only)
		res.send('DELETE ' + req.path);
	});

router.route('/events/:eventId/users/:userId/role/')
	.put(function (req, res, next) {
		// Change user's role (DJ only)
		res.send('PUT ' + req.path);
	});

router.route('/events/:eventId/playlist/')
	.post(function (req, res, next) {
		// Add song to playlist
		res.send('POST ' + req.path);
	})
	.get(function (req, res, next) {
		// Get all songs in the playlist in their proper order
		res.send(mocks.events[0].playlist.songs);
	})
	.put(function (req, res, next) {
		// Reorder songs in the playlist (DJ/Promoted only)
		res.send('PUT ' + req.path);
	});

router.route('/events/:eventId/playlist/:songId/')
	.delete(function (req, res, next) {
		// Remove song from playlist
		res.send('DELETE ' + req.path);
	});

router.route('/events/:eventId/playlist/:songId/votes/:userId/')
	.put(function (req, res, next) {
		// Place vote on song
		res.send('PUT ' + req.path);
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