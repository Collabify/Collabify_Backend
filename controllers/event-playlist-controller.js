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
 * @param {Song}		req.body				The body of the request - The song to add
 * @param {String} 		req.body.title 			The song's title
 * @param {String} 		req.body.artist 		The artist of the song
 * @param {String} 		req.body.album 			The album the song appears on
 * @param {Number} 		req.body.year 			The year the album was released
 * @param {String} 		req.body.songId			The Spotify ID for the song
 * @param {String} 		req.body.artworkUrl 	The URL to retrieve the album art
 * @param {Song}		res 					The server response - The newly added song
 * @param {String} 		res.title 				The song's title
 * @param {String} 		res.artist 				The artist of the song
 * @param {String} 		res.album 				The album the song appears on
 * @param {Number} 		res.year 				The year the album was released
 * @param {String} 		res.songId				The Spotify ID for the song
 * @param {String} 		res.artworkUrl 			The URL to retrieve the album art
 * @param {String} 		res.userId				The Spotify ID of the user who added the song
 * @param {Number}		res.voteCount			The song's vote count starts at 0
 * @param {Vote}
 */
module.exports.post = function (req, res) {
	helpers.getNichtBlacklistedUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
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

		// Return the newly created song object, filtered to show only the user's vote
		song = helpers.getSongFromPlaylist(event, req.body.songId);

		var filteredSong = helpers.filterVotesForSong(song, user.userId);
		res.status(status.OK_CREATE_RESOURCE).send(filteredSong);
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
 * @param {Song[]}	res 				The server response - All songs in the playlist
 * @param {String}	res[].title			The title of the song
 * @param {String} 	res[].artist		The name of the artist
 * @param {String} 	res[].album			The name of the album the song appears on
 * @param {Number}	res[].year			The year the song was released
 * @param {String} 	res[].songId		The Spotify ID for the song
 * @param {String} 	res[].artworkUrl	The URL where the album art can be found
 * @param {String} 	res[].userId		The Spotify ID of the user who added the song
 * @param {Number}	res[].voteCount		The song's current number of (upvotes - downvotes)
 * @param {Vote}	res[].vote			The vote placed by the user for the song
 * @param {Boolean}	res[].isUpvoted		Whether the user upvoted the song
 * @param {Boolean}	res[].isDownvoted	Whether the user downvoted the song
 */
module.exports.get = function (req, res) {
	helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		var songs = helpers.filterVotesForPlaylist(event.playlist, req.headers.userid).songs;
		res.status(status.OK_GET_RESOURCE).send(songs);
	});
};

/**
 * PUT /events/:eventId/playlist/ - Move a song in the playlist
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * <p>Postconditions: <br>
 * The specified song is moved from the old index to the new index
 *
 * @todo Once WebSockets are implemented, this endpoint should work for Promoted users as well
 *
 * @param 			req 					The client request
 * @param 			req.headers 			The headers in the HTTP request
 * @param {String}	req.headers.userid 		The user's Spotify ID
 * @param {String}	req.headers.oldindex	The old index for the song
 * @param {String}	req.headers.newindex	The new index for the song
 * @param {Song[]}	res						The server response - The reordered list of songs
 * @param {String}	res[].title				The title of the song
 * @param {String} 	res[].artist			The name of the artist
 * @param {String} 	res[].album				The name of the album the song appears on
 * @param {Number}	res[].year				The year the song was released
 * @param {String} 	res[].songId			The Spotify ID for the song
 * @param {String} 	res[].artworkUrl		The URL where the album art can be found
 * @param {String} 	res[].userId			The Spotify ID of the user who added the song
 * @param {Number}	res[].voteCount			The song's current number of (upvotes - downvotes)
 * @param {Vote}	res[].vote				The vote placed by the user for the song
 * @param {Boolean}	res[].isUpvoted			Whether the user upvoted the song
 * @param {Boolean}	res[].isDownvoted		Whether the user downvoted the song
 */
module.exports.put = function (req, res) {
	helpers.getDJUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		if (req.headers.oldindex < 0 || req.headers.oldindex >= event.playlist.songs.length
			|| req.headers.newindex < 0 || req.headers.newindex > event.playlist.songs.length) {
			logger.error('Bad index given for moving song');
			return res.sendStatus(status.ERR_BAD_REQUEST);
		}

		var song = event.playlist.songs.splice(req.headers.oldindex, 1)[0];
		event.playlist.songs.splice(req.headers.newindex, 0, song);
		event.save();

		var songs = helpers.filterVotesForPlaylist(event.playlist, req.headers.userid).songs;
		res.status(status.OK_UPDATE_RESOURCE).send(songs);
	});
};