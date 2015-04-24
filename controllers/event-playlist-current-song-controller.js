var _			= require('underscore');
var helpers		= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');

/** @module */

/**
 * DELETE /events/:eventId/playlist/currentSong/ - End the currently playing song
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * <p>Postconditions: <br>
 * The list of songs is resorted by votes <br>
 * The next song becomes the current song <br>
 * The first song in the song list becomes the next song <br>
 *
 * @param 				req 							The client request
 * @param {Playlist} 	res								The server response - The updated playlist
 * @param {Song}		res.currentSong					The currently playing song
 * @param {String}		res.currentSong.title			The title of the song
 * @param {String} 		res.currentSong.artist			The name of the artist
 * @param {String} 		res.currentSong.album			The name of the album the song appears on
 * @param {Number}		res.currentSong.year			The year the song was released
 * @param {String} 		res.currentSong.songId			The Spotify ID for the song
 * @param {String} 		res.currentSong.artworkUrl		The URL where the album art can be found
 * @param {String} 		res.currentSong.userId			The Spotify ID of the user who added the song
 * @param {Number}		res.currentSong.voteCount		The song's current number of (upvotes - downvotes)
 * @param {Vote}		res.currentSong.vote			The vote placed by the user for the song
 * @param {Boolean}		res.currentSong.isUpvoted		Whether the user upvoted the song
 * @param {Boolean}		res.currentSong.isDownvoted		Whether the user downvoted the song
 * @param {Song}		res.nextSong					The next song to be played
 * @param {String}		res.nextSong.title				The title of the song
 * @param {String} 		res.nextSong.artist				The name of the artist
 * @param {String} 		res.nextSong.album				The name of the album the song appears on
 * @param {Number}		res.nextSong.year				The year the song was released
 * @param {String} 		res.nextSong.songId				The Spotify ID for the song
 * @param {String} 		res.nextSong.artworkUrl			The URL where the album art can be found
 * @param {String} 		res.nextSong.userId				The Spotify ID of the user who added the song
 * @param {Number}		res.nextSong.voteCount			The song's current number of (upvotes - downvotes)
 * @param {Vote}		res.nextSong.vote				The vote placed by the user for the song
 * @param {Boolean}		res.nextSong.isUpvoted			Whether the user upvoted the song
 * @param {Boolean}		res.nextSong.isDownvoted		Whether the user downvoted the song
 * @param {Song[]}		res.songs						The playlist's list of songs
 * @param {String}		res.songs[].title				The title of the song
 * @param {String} 		res.songs[].artist				The name of the artist
 * @param {String} 		res.songs[].album				The name of the album the song appears on
 * @param {Number}		res.songs[].year				The year the song was released
 * @param {String} 		res.songs[].songId				The Spotify ID for the song
 * @param {String} 		res.songs[].artworkUrl			The URL where the album art can be found
 * @param {String} 		res.songs[].userId				The Spotify ID of the user who added the song
 * @param {Number}		res.songs[].voteCount			The song's current number of (upvotes - downvotes)
 * @param {Vote}		res.songs[].vote				The vote placed by the user for the song
 * @param {Boolean}		res.songs[].isUpvoted			Whether the user upvoted the song
 * @param {Boolean}		res.songs[].isDownvoted			Whether the user downvoted the song
 */
module.exports.delete = function (req, res) {
	helpers.getEvent(req.eventId, res, function (event) {
		// Because _.sortBy() sorts in ascending order, we need to negate
		// the songs' voteCounts in order to sort them properly
		event.playlist.songs = _.sortBy(event.playlist.songs, function (song) {
			return -1 * song.voteCount;
		});

		event.playlist.currentSong = event.playlist.nextSong;

		if (event.playlist.songs.length > 0) {
			// Grab the next song from the front of the list
			event.playlist.nextSong = event.playlist.songs.splice(0, 1)[0];
		} else {
			event.playlist.nextSong = null;
		}

		event.save();

		var playlist = helpers.filterVotesForPlaylist(event.playlist, req.eventId);
		res.status(status.OK_DELETE_RESOURCE).send(playlist);
	});
};