var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

module.exports.post = function (req, res) {
	helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		// Blacklisted users are not allowed to add songs
		if (user.role == 'Blacklisted') {
			logger.error('User is Blacklisted');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		// Check to see if the song is already in the playlist
		var song = helpers.getSongFromPlaylist(event, req.body.songId);

		if (song != undefined) {
			logger.error('Song is already in the playlist');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		// Add the song to the playlist
		event.playlist.songs.push(req.body);
		event.save();

		return res.sendStatus(status.OK_CREATE_RESOURCE);
	});
};

module.exports.get = function (req, res) {
	helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		res.status(status.OK_GET_RESOURCE).send(event.playlist.songs);
	});
};

module.exports.put = function (req, res) {
	helpers.getEventAsDJOrPromoted(req.headers.userid, req.eventId, res, function (event) {
		event.playlist = req.body;
		event.save();

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};