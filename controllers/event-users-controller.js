var helpers		= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

/** @module */

function copyEventForCollabifier(event, userId) {
	var eventCopy = helpers.deepCopy(event);

	eventCopy.playlist = helpers.filterVotesForPlaylist(eventCopy.playlist, userId);

	// The user list shouldn't be visible to anyone but the DJ
	delete eventCopy.userIds;

	return eventCopy;
}

/**
 * POST /events/:eventId/users/ - Join event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is not at another event <br>
 *
 * <p>Postconditions: <br>
 * User is added to the event's user list if they weren't already <br>
 * User's eventId is changed to match the event if they weren't already at the event <br>
 * User's role is changed to 'Collabifier' if they weren't already at the event <br>
 *
 * @param 					req 									The client request
 * @param 					req.headers 							The headers in the HTTP request
 * @param {String} 			req.headers.userid 						The user's Spotify ID
 * @param {Event}			res										The server response - The event the user just joined
 * @param {String} 			res.name								The name of the event
 * @param {String}			res.eventId								The ID of the event, equal to the DJ's userId
 * @param {Location}		res.location							The location of the event
 * @param {Number}			res.location.latitude					The latitude of the event
 * @param {Number}			res.location.longitude					The longitude of the event
 * @param {Playlist} 		res.playlist							The event's playlist
 * @param {Song}			res.playlist.currentSong				The currently playing song
 * @param {String}			res.playlist.currentSong.title			The title of the song
 * @param {String} 			res.playlist.currentSong.artist			The name of the artist
 * @param {String} 			res.playlist.currentSong.album			The name of the album the song appears on
 * @param {Number}			res.playlist.currentSong.year			The year the song was released
 * @param {String} 			res.playlist.currentSong.songId			The Spotify ID for the song
 * @param {String} 			res.playlist.currentSong.artworkUrl		The URL where the album art can be found
 * @param {String} 			res.playlist.currentSong.userId			The Spotify ID of the user who added the song
 * @param {Number}			res.playlist.currentSong.voteCount		The song's current number of (upvotes - downvotes)
 * @param {Vote}			res.playlist.currentSong.vote			The vote placed by the user for the song
 * @param {Boolean}			res.playlist.currentSong.isUpvoted		Whether the user upvoted the song
 * @param {Boolean}			res.playlist.currentSong.isDownvoted	Whether the user downvoted the song
 * @param {Song}			res.playlist.nextSong					The next song to be played
 * @param {String}			res.playlist.nextSong.title				The title of the song
 * @param {String} 			res.playlist.nextSong.artist			The name of the artist
 * @param {String} 			res.playlist.nextSong.album				The name of the album the song appears on
 * @param {Number}			res.playlist.nextSong.year				The year the song was released
 * @param {String} 			res.playlist.nextSong.songId			The Spotify ID for the song
 * @param {String} 			res.playlist.nextSong.artworkUrl		The URL where the album art can be found
 * @param {String} 			res.playlist.nextSong.userId			The Spotify ID of the user who added the song
 * @param {Number}			res.playlist.nextSong.voteCount			The song's current number of (upvotes - downvotes)
 * @param {Vote}			res.playlist.nextSong.vote				The vote placed by the user for the song
 * @param {Boolean}			res.playlist.nextSong.isUpvoted			Whether the user upvoted the song
 * @param {Boolean}			res.playlist.nextSong.isDownvoted		Whether the user downvoted the song
 * @param {Song[]}			res.playlist.songs						The playlist's list of songs
 * @param {String}			res.playlist.songs[].title				The title of the song
 * @param {String} 			res.playlist.songs[].artist				The name of the artist
 * @param {String} 			res.playlist.songs[].album				The name of the album the song appears on
 * @param {Number}			res.playlist.songs[].year				The year the song was released
 * @param {String} 			res.playlist.songs[].songId				The Spotify ID for the song
 * @param {String} 			res.playlist.songs[].artworkUrl			The URL where the album art can be found
 * @param {String} 			res.playlist.songs[].userId				The Spotify ID of the user who added the song
 * @param {Number}			res.playlist.songs[].voteCount			The song's current number of (upvotes - downvotes)
 * @param {Vote}			res.playlist.songs[].vote				The vote placed by the user for the song
 * @param {Boolean}			res.playlist.songs[].isUpvoted			Whether the user upvoted the song
 * @param {Boolean}			res.playlist.songs[].isDownvoted		Whether the user downvoted the song
 * @param {EventSettings}	res.settings							The settings for the event
 * @param {String}			res.settings.password					The event password (or null if there isn't one)
 * @param {Boolean}			res.settings.locationRestricted			Whether to restrict the event to nearby users
 * @param {Boolean}			res.settings.allowVoting				Whether to allow users to vote
 */
module.exports.post = function (req, res) {
	helpers.getUser(req.headers.userid, res, function (user) {
		if (user.eventId == req.eventId) {
			// Nothing to do, the user is already at the event
			return helpers.getEvent(req.eventId, res, function (event) {
				var eventCopy = copyEventForCollabifier(event, req.headers.userid);
				return res.status(status.OK_CREATE_RESOURCE).send(eventCopy);
			});
		} else if (user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		helpers.getEvent(req.eventId, res, function (event) {
			user.role = 'Collabifier';
			user.eventId = req.eventId;
			user.save();

			event.userIds.push(user.userId);
			event.save();

			var eventCopy = copyEventForCollabifier(event, req.headers.userid);
			return res.status(status.OK_CREATE_RESOURCE).send(eventCopy);
		});
	});
};

/**
 * GET /events/:eventId/users/ - Get list of users at event (not including the DJ)
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * @param 			req 					The client request
 * @param {User[]}	res 					The server response - The list of users at the event not including the DJ
 * @param {String}	res[].name				The user's name
 * @param {String}	res[].userId			The user's Spotify ID
 * @param {String}	res[].role				The user's role
 */
module.exports.get = function (req, res) {
	helpers.getEvent(req.eventId, res, function (event) {
		// Find all users at the event
		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};