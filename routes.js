var express				= require('express');
var router				= express.Router();
var logger				= require('./logger');

var UsersController							= require('./controllers/users-controller');
var UserController							= require('./controllers/user-controller');
var EventsController						= require('./controllers/events-controller');
var EventController							= require('./controllers/event-controller');
var EventUsersController					= require('./controllers/event-users-controller');
var EventUserController						= require('./controllers/event-user-controller');
var EventUserRoleController					= require('./controllers/event-user-role-controller');
var EventPlaylistController					= require('./controllers/event-playlist-controller');
var EventPlaylistSongController				= require('./controllers/event-playlist-song-controller');
var EventPlaylistSongVotesUserController	= require('./controllers/event-playlist-song-votes-user-controller');

/** @module */

// Routes
router.route('/users/')
	.post(function (req, res, next) {
		// Add a user to the database
		UsersController.post(req, res);
	});

router.route('/users/:userId/')
	.get(function (req, res, next) {
		// Get user details
		UserController.get(req, res);
	})

router.route('/users/:userId/settings')
	.put(function (req, res, next) {
		// Change settings (Collabifier only)
		UserSettingsController.put(req, res);
	})
	.delete(function (req, res, next) {
		// Log out the user and delete them from the database
		UserSettingsController.delete(req, res);
	});

router.route('/events/')
	.post(function (req, res, next) {
		// Create a new event
		EventsController.post(req, res);
	})
	.get(function (req, res, next) {
		// Get all events near provided coordinates
		EventsController.get(req, res);
	});

router.route('/events/:eventId/')
	.get(function (req, res, next) {
		// Get current settings for the event (DJ only)
		EventController.get(req, res);
	})
	.put(function (req, res, next) {
		// Change settings for the event (DJ only)
		EventController.put(req, res);
	})
	.delete(function (req, res, next) {
		// End event (DJ only)
		EventController.delete(req, res);
	});

router.route('/events/:eventId/users/')
	.post(function (req, res, next) {
		// Join event (Collabifier only)
		EventUsersController.post(req, res);
	})
	.get(function (req, res, next) {
		// Get list of users at event (DJ only)
		EventUsersController.get(req, res);
	});

router.route('/events/:eventId/users/:userId/')
	.delete(function (req, res, next) {
		// Leave event (Collabifier only)
		EventUserController.delete(req, res);
	});

router.route('/events/:eventId/users/:userId/role/')
	.put(function (req, res, next) {
		// Change user's role (DJ only)
		EventUserRoleController.put(req, res);
	});

router.route('/events/:eventId/playlist/')
	.post(function (req, res, next) {
		// Add song to playlist
		EventPlaylistController.post(req, res);
	})
	.get(function (req, res, next) {
		// Get all songs in the playlist in their proper order
		EventPlaylistController.get(req, res);
	})
	.put(function (req, res, next) {
		// Reorder songs in the playlist (DJ only)
		EventPlaylistController.put(req, res);
	});

router.route('/events/:eventId/playlist/:songId/')
	.delete(function (req, res, next) {
		// Remove song from playlist
		EventPlaylistSongController.delete(req, res);
	});

router.route('/events/:eventId/playlist/:songId/votes/:userId/')
	.put(function (req, res, next) {
		// Place vote on song
		EventPlaylistSongVotesUserController.put(req, res);
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