var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User		= require('../models/user').User;

module.exports.getUser = function (userId, res, callback) {
	User.findOne({userId: userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		callback(user);
	});
};

module.exports.getEvent = function (eventId, res, callback) {
	Event.findOne({eventId: eventId}, function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		callback(event);
	});
};

module.exports.getUserAtEvent = function (userId, eventId, res, callback) {
	module.exports.getUser(userId, res, function (user) {
		if (user.eventId != eventId) {
			logger.error('User not at event');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		module.exports.getEvent(eventId, res, function (event) {
			callback(user, event);
		});
	});
};

module.exports.getEventAsDJ = function (userId, eventId, res, callback) {
	module.exports.getUserAtEvent(userId, eventId, res, function (user, event) {
		if (user.role != 'DJ') {
			logger.error('User is not the DJ');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		callback(event);
	});
};

module.exports.getEventAsDJOrPromoted = function (userId, eventId, res, callback) {
	module.exports.getUserAtEvent(userId, eventId, res, function (user, event) {
		if (user.role != 'DJ' && user.role != 'Promoted') {
			logger.error('User is not the DJ or a Promoted Collabifier');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		callback(event);
	});
};

module.exports.getSongFromPlaylist = function (event, songId) {
	/** @todo Find a better way to do this */
	var song = event.playlist.songs.filter(function (song) {
		if (song.songId == req.body.song.songId) {
			return true;
		}

		return false;
	})[0];

	return song;
};
