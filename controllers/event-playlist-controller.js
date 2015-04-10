var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

/** @module */

/**
 * POST /events/:eventId/playlist/ - Add song to playlist
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 * User is not blacklisted <br>
 * Song is not already in the playlist <br>
 *
 * <p>Postconditions: <br>
 * Song is added to the end of the playlist <br>
 *
 * @param 				req 					The client request
 * @param				req.headers				The headers in the HTTP request
 * @param {String} 		req.headers.userid 		The user's Spotify ID
 * @param				req.body				The body of the request
 * @param {String} 		req.body.title 			The song's title
 * @param {String} 		req.body.artist 		The artist of the song
 * @param {String} 		req.body.album 			The album the song appears on
 * @param {Number} 		req.body.year 			The year the album was released
 * @param {String} 		req.body.artworkUrl 	The URL to retrieve the album art
 * @param 				res 					The server response
 */
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

		// Manually add the userId
		req.body.userId = user.userId;

		// Add the song to the playlist
		event.playlist.songs.push(req.body);
		event.save();

		return res.sendStatus(status.OK_CREATE_RESOURCE);
	});
};

/**
 * GET /events/:eventId/playlist/ - Get all songs in the playlist in their proper order
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 *
 * @param 			req 				The client request
 * @param 			req.headers 		The headers in the HTTP request
 * @param {String} 	req.headers.userid 	The user's Spotify ID
 * @param 			res 				The server response
 * @param {String}	res[i].title		The title of the song
 * @param {String} 	res[i].artist		The name of the artist
 * @param {String} 	res[i].album		The name of the album the song appears on
 * @param {Number}	res[i].year			The year the song was released
 * @param {String} 	res[i].songId		The Spotify ID for the song
 * @param {String} 	res[i].artworkUrl	The URL where the album art can be found
 * @param {String} 	res[i].userId		The Spotify ID of the user who added the song
 * @param {Number}	res[i].votes		The song's current number of (upvotes - downvotes)
 */
module.exports.get = function (req, res) {
	helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		res.status(status.OK_GET_RESOURCE).send(event.playlist.songs);
	});
};

/**
 * PUT /events/:eventId/playlist/ - Reorder songs in the playlist
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ or a Promoted Collabifier for the requested event <br>
 *
 * <p>Postconditions: <br>
 * Songs in the playlist are reordered accordingly
 *
 * @param 			req 				The client request
 * @param 			req.headers 		The headers in the HTTP request
 * @param {String}	req.headers.userid 	The user's Spotify ID
 * @param 			req.body 			The body of the request
 * @param {String}	req[i].title		The title of the song
 * @param {String} 	req[i].artist		The name of the artist
 * @param {String} 	req[i].album		The name of the album the song appears on
 * @param {Number}	req[i].year			The year the song was released
 * @param {String} 	req[i].songId		The Spotify ID for the song
 * @param {String} 	req[i].artworkUrl	The URL where the album art can be found
 * @param {String} 	req[i].userId		The Spotify ID of the user who added the song
 * @param {Number}	[req[i].votes=0]	The song's current number of (upvotes - downvotes)
 * @param			res					The server response
 */
module.exports.put = function (req, res) {
	helpers.getEventAsDJOrPromoted(req.headers.userid, req.eventId, res, function (event) {
		event.playlist.songs = req.body;
		event.save();

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};