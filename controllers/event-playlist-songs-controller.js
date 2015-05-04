var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

/**
 * POST /events/:eventId/playlist/songs/ - Add song to playlist
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
 * @param               req                                 The client request
 * @param               req.headers                         The headers in the HTTP request
 * @param {String}      req.headers.userid                  The user's Spotify ID
 * @param {Song}        req.body                            The body of the request - The song to add
 * @param {String}      req.body.title                      The song's title
 * @param {String}      req.body.artist                     The artist of the song
 * @param {String}      req.body.album                      The album the song appears on
 * @param {Number}      req.body.year                       The year the album was released
 * @param {String}      req.body.songId                     The Spotify ID for the song
 * @param {String}      req.body.artworkUrl                 The URL to retrieve the album art
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
module.exports.post = function (req, res) {
    helpers.getNichtBlacklistedUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
        // Check to see if the song is already in the playlist
        var song = helpers.getSongFromPlaylist(event, req.body.songId);

        if (song != undefined) {
            return new CollabifyError(status.ERR_RESOURCE_EXISTS, 'Song is already in the playlist').send(res);
        }

        helpers.addSongToPlaylist(user, event, req.body);

        var playlist = helpers.filterVotesForPlaylist(event.playlist, req.headers.userid);
        res.status(status.OK_CREATE_RESOURCE).send(playlist);
    });
};

/**
 * PUT /events/:eventId/playlist/songs/ - Move a song in the playlist
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
 * @param               req                                 The client request
 * @param               req.headers                         The headers in the HTTP request
 * @param {String}      req.headers.oldindex                The old index for the song
 * @param {String}      req.headers.newindex                The new index for the song
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
module.exports.put = function (req, res) {
    helpers.getEvent(req.eventId, res, function (event) {
        if (req.headers.oldindex < 0 || req.headers.oldindex >= event.playlist.songs.length
            || req.headers.newindex < 0 || req.headers.newindex > event.playlist.songs.length) {
            return new CollabifyError(status.ERR_BAD_REQUEST, 'Bad index given for moving song').send(res);
        }

        // Remove the song from its old position
        var song = event.playlist.songs.splice(req.headers.oldindex, 1)[0];

        // Re-add the song at its new position
        event.playlist.songs.splice(req.headers.newindex, 0, song);

        event.save();

        var playlist = helpers.filterVotesForPlaylist(event.playlist, req.eventId);
        res.status(status.OK_UPDATE_RESOURCE).send(playlist);
    });
};