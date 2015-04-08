var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User 		= require('../models/user').User;

module.exports.delete = function (req, res) {
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

			// Find the song in the playlist
			/** @todo Find a better way to do this */
			var song = event.playlist.songs.filter(function (song) {
				if (song.songId == req.songId) {
					return true;
				}

				return false;
			})[0];

			if (song == undefined) {
				logger.error('Song not in playlist');
				return res.sendStatus(status.ERROR_RESOURCE_NOT_FOUND);
			} else if (user.userId != song.userId && user.role != 'DJ' && user.role != 'Promoted') {
				logger.error('User is not allowed to delete the song');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			}

			song.remove();
			event.save();

			res.sendStatus(status.OK_DELETE_RESOURCE);
		});
	});
};