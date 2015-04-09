var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

 /** @module */

 /**
 * DELETE /events/:eventId/playlist/:songId/ - Remove song from the playlist
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 * User is the one who added the song, or is the DJ or a Promoted Collabifier <br>
 *
 * <p>Postconditions: <br>
 * Song is removed from the event's playlist <br>
 *
 * @param 				req 					The client request
 * @param 				req.headers 			The headers in the HTTP request
 * @param {String}		req.headers.userid 		The user's Spotify ID
 * @param 				res 					The server response
 */
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