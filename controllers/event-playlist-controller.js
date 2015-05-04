var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

/**
 * GET /events/:eventId/playlist/ - Get the playlist
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 *
 * @param               req                                 The client request
 * @param               req.headers                         The headers in the HTTP request
 * @param {String}      req.headers.userid                  The user's Spotify ID
 * @param {Playlist}    res                                 The server response - The event's playlist
 * @param {Song}        res.currentSong                     The currently playing song
 * @param {String}      res.currentSong.title               The title of the song
 * @param {String}      res.currentSong.artist              The name of the artist
 * @param {String}      res.currentSong.album               The name of the album the song appears on
 * @param {Number}      res.currentSong.year                The year the song was released
 * @param {String}      res.currentSong.songId              The Spotify ID for the song
 * @param {String}      res.currentSong.artworkUrl          The URL where the album art can be found
 * @param {String}      res.currentSong.userId              The Spotify ID of the user who added the song
 * @param {String}      res.currentSong.username            The name of the user who added the song, or 'Anonymous' if they do not want to show their username
 * @param {Number}      res.currentSong.voteCount           The song's current number of (upvotes - downvotes)
 * @param {Vote}        res.currentSong.vote                The vote placed by the user for the song
 * @param {Boolean}     res.currentSong.vote.isUpvoted      Whether the user upvoted the song
 * @param {Boolean}     res.currentSong.vote.isDownvoted    Whether the user downvoted the song
 * @param {Song}        res.nextSong                        The next song to be played
 * @param {String}      res.nextSong.title                  The title of the song
 * @param {String}      res.nextSong.artist                 The name of the artist
 * @param {String}      res.nextSong.album                  The name of the album the song appears on
 * @param {Number}      res.nextSong.year                   The year the song was released
 * @param {String}      res.nextSong.songId                 The Spotify ID for the song
 * @param {String}      res.nextSong.artworkUrl             The URL where the album art can be found
 * @param {String}      res.nextSong.userId                 The Spotify ID of the user who added the song
 * @param {String}      res.nextSong.username               The name of the user who added the song, or 'Anonymous' if they do not want to show their username
 * @param {Number}      res.nextSong.voteCount              The song's current number of (upvotes - downvotes)
 * @param {Vote}        res.nextSong.vote                   The vote placed by the user for the song
 * @param {Boolean}     res.nextSong.vote.isUpvoted         Whether the user upvoted the song
 * @param {Boolean}     res.nextSong.vote.isDownvoted       Whether the user downvoted the song
 * @param {Song[]}      res.songs                           The playlist's list of songs
 * @param {String}      res.songs[].title                   The title of the song
 * @param {String}      res.songs[].artist                  The name of the artist
 * @param {String}      res.songs[].album                   The name of the album the song appears on
 * @param {Number}      res.songs[].year                    The year the song was released
 * @param {String}      res.songs[].songId                  The Spotify ID for the song
 * @param {String}      res.songs[].artworkUrl              The URL where the album art can be found
 * @param {String}      res.songs[].userId                  The Spotify ID of the user who added the song
 * @param {String}      res.songs[].username                The name of the user who added the song, or 'Anonymous' if they do not want to show their username
 * @param {Number}      res.songs[].voteCount               The song's current number of (upvotes - downvotes)
 * @param {Vote}        res.songs[].vote                    The vote placed by the user for the song
 * @param {Boolean}     res.songs[].vote.isUpvoted          Whether the user upvoted the song
 * @param {Boolean}     res.songs[].vote.isDownvoted        Whether the user downvoted the song
 */
module.exports.get = function (req, res) {
    helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
        var playlist = helpers.filterVotesForPlaylist(event.playlist, req.headers.userid);
        res.status(status.OK_GET_RESOURCE).send(playlist);
    });
};