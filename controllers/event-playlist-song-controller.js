var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

module.exports.delete = function (req, res) {
	helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		var song = helpers.getSongFromPlaylist(event, req.songId);

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
};