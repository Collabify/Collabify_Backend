var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User		= require('../models/user').User;

module.exports.post = function (req, res) {
	/** @todo Check if req.body.song is undefined */
	/** @todo Make sure user isn't blacklisted */
	User.findOne({userId: req.body.song.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		} else if (user.eventId != req.eventId) {
			logger.error('User not at event');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		Event.findOne({eventId: req.eventId}, function (err, event) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (event == null) {
				logger.error('Event not found');
				return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			}

			// Check to see if the song is already in the playlist
			/** @todo Find a better way to do this */
			var song = event.playlist.songs.filter(function (song) {
				if (song.songId == req.body.song.songId) {
					return true;
				}

				return false;
			})[0];

			if (song != undefined) {
				logger.error('Song is already in the playlist');
				return res.sendStatus(status.ERR_RESOURCE_EXISTS);
			}

			// Add the song to the playlist
			event.playlist.songs.push(req.body.song);
			event.save();

			return res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

module.exports.get = function (req, res) {
	/** @todo Remove warnings about empty results */
	/** @todo Update error codes for 'not at' */
	Event.findOne({eventId: req.eventId}, function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		User.findOne({userId: req.body.userId}, function (err, user) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (user == null) {
				logger.error('User not found');
				return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			} else if (user.eventId != req.eventId) {
				logger.error('User not at event');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			}

			res.status(status.OK_GET_RESOURCE).send(event.playlist.songs);
		});
	});
};

module.exports.put = function (req, res) {
	Event.findOne({eventId: req.eventId}, function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		User.findOne({userId: req.body.userId}, function (err, user) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (user == null) {
				logger.error('User not found');
				return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			} else if (user.eventId != req.eventId) {
				logger.error('User not at event');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			} else if (user.role != 'DJ' && user.role != 'Promoted') {
				logger.error('User is not the DJ or a Promoted Collabifier');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			}

			event.playlist = req.body.playlist;
			event.save();

			res.sendStatus(status.OK_UPDATE_RESOURCE);
		});
	});
};