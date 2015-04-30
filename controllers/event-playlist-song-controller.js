var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

/**
 * DELETE /events/:eventId/playlist/songs/:songId/ - Remove song from the playlist's list of songs
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
 * @param               req                     The client request
 * @param               req.headers             The headers in the HTTP request
 * @param {String}      req.headers.userid      The user's Spotify ID
 * @param               res                     The server response
 */
module.exports.delete = function (req, res) {
    helpers.getUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
        var song = helpers.getSongFromSongs(event, req.songId);

        if (song == undefined) {
            return new CollabifyError(status.ERROR_RESOURCE_NOT_FOUND, 'Song not in playlist').send(res);
        } else if (user.userId != song.userId && user.role != 'DJ' && user.role != 'Promoted') {
            return new CollabifyError(status.ERR_UNAUTHORIZED, 'User is not allowed to delete the song').send(res);
        }

        song.remove();
        event.save();

        res.sendStatus(status.OK_DELETE_RESOURCE);
    });
};