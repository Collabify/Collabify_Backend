var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

function handleNewVote(req, res, event, song) {
    if (req.body.isUpvoted) {
        song.voteCount++;
    } else if (req.body.isDownvoted) {
        song.voteCount--;
    }

    // Manually fill in the userId
    req.body.userId = req.userId;

    song.votes.push(req.body);
    event.save();

    // Return the newly create vote
    var vote = helpers.getVoteFromSong(song, req.userId);
    res.status(status.OK_CREATE_RESOURCE).send(vote);
}

function handleUpdatedVote(req, res, event, song, vote) {
    if (req.body.isUpvoted) {
        if (vote.isDownvoted) {
            song.voteCount += 2;
        } else if (!vote.isUpvoted) {
            song.voteCount++;
        }
    } else if (req.body.isDownvoted) {
        if (vote.isUpvoted) {
            song.voteCount -= 2;
        } else if (!song.isDownvoted) {
            song.voteCount--;
        }
    } else {
        if (vote.isUpvoted) {
            song.voteCount--;
        } else if (vote.isDownvoted) {
            song.voteCount++;
        }
    }

    vote.isUpvoted = req.body.isUpvoted;
    vote.isDownvoted = req.body.isDownvoted;
    event.save();

    res.status(status.OK_UPDATE_RESOURCE).send(vote);
}

/**
 * PUT /events/:eventId/playlist/songs/:songId/votes/:userId/ - Place vote on song
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 * User is not blacklisted <br>
 * Song is in the playlist <br>
 * User is not trying to both upvote and downvote the song <br>
 *
 * <p>Postconditions: <br>
 * User's vote for the song is either created, or updated accordingly <br>
 * The song's overall vote count is updated accordingly <br>
 *
 * @param               req                     The client request
 * @param {Vote}        req.body                The body of the request - The user's vote
 * @param {Boolean}     req.body.isUpvoted      Whether the user has upvoted the song
 * @param {Boolean}     req.body.isDownvoted    Whether the user has downvoted the song
 * @param {Vote}        res                     The server response - The vote that was placed
 * @param {String}      res.userId              The user's Spotify ID
 * @param {Boolean}     res.sUpvoted            Whether the user has upvoted the song
 * @param {Boolean}     res.isDownvoted         Whether the user has downvoted the song
 */
module.exports.put = function (req, res) {
    if (req.body.isUpvoted && req.body.isDownvoted) {
        return new CollabifyError(status.ERR_BAD_REQUEST,
                                  "Can't upvote and downvote a song at the same time").send(res);
    }

    helpers.getNichtBlacklistedUserAtEvent(req.userId, req.eventId, res, function (user, event) {
        var song = helpers.getSongFromPlaylist(event, req.songId);

        if (song == undefined) {
            return new CollabifyError(status.ERR_RESOURCE_NOT_FOUND, 'Song not in playlist').send(res);
        }

        var vote = helpers.getVoteFromSong(song, req.userId);

        if (vote == undefined) {
            // User's first time voting for this song
            handleNewVote(req, res, event, song);
        } else {
            // Update the current vote
            handleUpdatedVote(req, res, event, song, vote);
        }
    });
};