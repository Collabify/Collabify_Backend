var _               = require('underscore');
var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');
var Event           = require('../models/event').Event;
var User            = require('../models/user').User;

/** @module */

/**
 * Finds a user in the database and, if found, passes it to a callback
 *
 * @param {String}      userId          The userId to search for
 * @param {String}      [select=null]   Optional select parameter
 * @param               res             The server response
 * @param {Function}    callback(user)  Callback with the user found
 */
module.exports.getUser = function (userId, select, res, callback) {
    if (arguments.length == 3) {
        // select parameter was not passed
        callback = arguments[2];
        res = arguments[1];
        select = null;
    }

    User.findOne({userId: userId}, select, function (err, user) {
        if (err) {
            return new CollabifyError(status.ERR_BAD_REQUEST,
                                      'Unexpected error while querying for user').send(res);
        } else if (user == null) {
            return new CollabifyError(status.ERR_RESOURCE_NOT_FOUND, 'User not found').send(res);
        }

        callback(user);
    });
};

/**
 * Finds an event in the database and, if found, passes it to a callback
 *
 * @param {String}      eventId         The eventId to search for
 * @param {String}      [select=null]   Optional select parameter
 * @param               res             The server response
 * @param {Function}    callback(event) Callback with the event found
 */
module.exports.getEvent = function (eventId, select, res, callback) {
    if (arguments.length == 3) {
        // select parameter was not passed
        callback = arguments[2];
        res = arguments[1];
        select = null;
    }

    Event.findOne({eventId: eventId}, select, function (err, event) {
        if (err) {
            return new CollabifyError(status.ERR_BAD_REQUEST,
                                      'Unexpected error while querying for event').send(res);
        } else if (event == null) {
            return new CollabifyError(status.ERR_RESOURCE_NOT_FOUND, 'Event not found').send(res);
        }

        callback(event);
    });
};

/**
 * Finds a user and event, making sure the user is at that event.  If found,
 * they are passed to a callback
 *
 * @param {String}      userId                  The userId to search for
 * @param {String}      eventId                 The eventId to search for
 * @param {String}      [eventSelect=null]      Optional select parameter for the event
 * @param               res                     The server response
 * @param {Function}    callback(user, event)   Callback with the user and event found
 */
module.exports.getUserAtEvent = function (userId, eventId, eventSelect, res, callback) {
    if (arguments.length == 4) {
        // eventSelect parameter was not passed
        callback = arguments[3];
        res = arguments[2];
        select = null;
    }

    module.exports.getUser(userId, res, function (user) {
        if (user.eventId != eventId) {
            return new CollabifyError(status.ERR_UNAUTHORIZED, 'User is not at event').send(res);
        }

        module.exports.getEvent(eventId, eventSelect, res, function (event) {
            callback(user, event);
        });
    });
};

/**
 * Finds a user and event, making sure the user is not Blacklisted at the event.  If
 * found, they are passed to a callback
 *
 * @param {String}      userId          The userId to search for
 * @param {String}      eventId         The eventId to search for
 * @param               res             The server response
 * @param {Function}    callback(event) Callback with the event found
 */
module.exports.getNichtBlacklistedUserAtEvent = function (userId, eventId, res, callback) {
    module.exports.getUserAtEvent(userId, eventId, res, function (user, event) {
        if (user.role == 'Blacklisted') {
            return new CollabifyError(status.ERR_UNAUTHORIZED, 'User is Blacklisted').send(res);
        }

        callback(user, event);
    });
};

/**
 * Finds a user and event, making sure the user is the DJ or a Promoted Collabifier
 * of the event.  If found, they are passed to a callback
 *
 * @param {String}      userId          The userId to search for
 * @param {String}      eventId         The eventId to search for
 * @param               res             The server response
 * @param {Function}    callback(event) Callback with the event found
 */
module.exports.getDJOrPromotedUserAtEvent = function (userId, eventId, res, callback) {
    module.exports.getUserAtEvent(userId, eventId, res, function (user, event) {
        if (user.role != 'DJ' && user.role != 'Promoted') {
            return new CollabifyError(status.ERR_UNAUTHORIZED,
                                      'User is not the DJ or a Promoted Collabifier').send(res);
        }

        callback(user, event);
    });
};

/**
 * Removes the user from the event.  If successful, the callback is invoked.
 *
 * @param {String}      userId      The userId to search for
 * @param {String}      eventId     The eventId to search for
 * @param               res         The server response
 * @param {Function}    callback()  Callback to invoke after leaving the event
 */
module.exports.leaveEvent = function (userId, eventId, res, callback) {
    module.exports.getUserAtEvent(userId, eventId, res, function (user, event) {
        if (user.role == 'DJ') {
            return new CollabifyError(status.ERR_BAD_REQUEST,
                                      'DJ cannot leave their own event').send(res);
        }

        var userIdIndex = event.userIds.indexOf(user.userId);

        if (userIdIndex == -1) {
            return new CollabifyError(status.ERR_RESOURCE_NOT_FOUND,
                                      'User is not at event').send(res);
        }

        // Remove the user from the event
        event.userIds.splice(userIdIndex, 1);
        event.save();

        user.eventId = null;
        user.role = 'NoRole';
        user.save();

        callback();
    });
};

/**
 * Ends the event.  If successful, the callback is invoked.
 *
 * @param {String}      eventId     The eventId to search for
 * @param               res         The server response
 * @param {Function}    callback()  Callback to invoke after ending the event
 */
module.exports.endEvent = function (eventId, res, callback) {
    module.exports.getEvent(eventId, res, function (event) {
        // Remove users from the event
        User.update({userId: {$in: event.userIds}}, {eventId: null, role: 'NoRole'}, function (err) {
            if (err) {
                return new CollabifyError(status.ERR_BAD_REQUEST,
                                          'Unexpected error while ending event').send(res);
            }

            // End the event
            event.remove();

            // Update the DJ
            module.exports.getUser(eventId, res, function (user) {
                user.eventId = null;
                user.role = 'NoRole';
                user.save();
            })

            callback();
        });
    });
};

/**
 * Attempts to find the song in the playlist's song list, which doesn't include the current or next songs
 *
 * @param   {Event}             event   The event whose playlist is to be searched
 * @param   {String}            songId  The songId to search for
 * @return  {Song|Undefined}            The song or undefined if not found
 */
module.exports.getSongFromSongs = function (event, songId) {
    /** @todo Find a better way to do this */
    var song = event.playlist.songs.filter(function (song) {
        if (song.songId == songId) {
            return true;
        }

        return false;
    })[0];

    return song;
};

/**
 * Attempts to find the song in the event's playlist, including the current and next songs
 *
 * @param   {Event}             event   The event whose playlist is to be searched
 * @param   {String}            songId  The songId to search for
 * @return  {Song|Undefined}            The song or undefined if not found
 */
module.exports.getSongFromPlaylist = function (event, songId) {
    var song = event.playlist.currentSong;

    if (song != null && song.songId == songId) {
        return song;
    }

    song = event.playlist.nextSong;

    if (song != null && song.songId == songId) {
        return song;
    }

    return module.exports.getSongFromSongs(event, songId);
};

/**
 * Attempts to find the user's vote for the song
 *
 * @param   {Song}              song    The song to search
 * @param   {String}            userId  The userId of the vote to search for
 * @return  {Vote|Undefined}            The vote or undefined if not found
 */
module.exports.getVoteFromSong = function (song, userId) {
    if (song.votes == undefined) {
        return null;
    }

    /** @todo Find a better way to do this */
    var vote = song.votes.filter(function (vote) {
        if (vote.userId == userId) {
            return true;
        }

        return false;
    })[0];

    return vote;
};

/**
 * Deep copies the provided object
 *
 * @todo Obviously this isn't a good way of deep copying
 *
 * @param   {Object}    object      The object to deep copy
 * @return  {Object}                A deep copy of the object
 */
module.exports.deepCopy = function (object) {
    return JSON.parse(JSON.stringify(object));
};

/**
 * Creates a deep copy of the song, filtered so that only the vote placed
 * by the user is returned.  The user's vote is placed in a 'vote' property for
 * the song.
 *
 * @param   {Song}      song        The song to filter
 * @param   {String}    userId      The user's Spotify ID
 * @return  {Song|null}             The filtered song, or null if the original song was null
 */
module.exports.filterVotesForSong = function (song, userId) {
    if (song == null) {
        return null;
    }

    var songCopy = module.exports.deepCopy(song);
    var vote = module.exports.getVoteFromSong(songCopy, userId);

    delete songCopy.votes;

    if (vote == undefined) {
        // User hasn't placed a vote on the song, return default data
        songCopy.vote = {
            isUpvoted: false,
            isDownvoted: false
        };
    } else {
        // User has placed a vote on the song, return only the upvote/downvote
        // information
        songCopy.vote = vote;
        delete songCopy.vote.userId;
    }

    return songCopy;
};

/**
 * Creates a deep copy of the playlist, filtered so that only the votes
 * placed by the user are returned.  The user's vote is placed in a 'vote'
 * property for each song.
 *
 * @param   {Playlist}  playlist    The playlist to filter
 * @param   {String}    userId      The user's Spotify ID
 * @return  {Playlist}              The filtered playlist
 */
module.exports.filterVotesForPlaylist = function (playlist, userId) {
    var songsCopy = module.exports.deepCopy(playlist.songs);

    // Filter votes in the playlist's song list
    songsCopy = songsCopy.map(function (song) {
        return module.exports.filterVotesForSong(song, userId);
    });

    var playlistCopy = {
        currentSong: module.exports.filterVotesForSong(playlist.currentSong, userId),
        nextSong: module.exports.filterVotesForSong(playlist.nextSong, userId),
        songs: songsCopy
    }

    return playlistCopy;
};

/**
 * Add song to the event's playlist.  If the playlist doesn't have a current song or next
 * song, those are updated before the song list.
 *
 * @param {Event}   event   The event whose playlist the song is being added to
 * @param {String}  userId  The Spotify ID of the user adding the song
 * @param {Song}    song    The song to add
 */
module.exports.addSongToPlaylist = function (event, userId, song) {
    // Manually add the userId, voteCount, and votes fields
    song.userId = userId;
    song.voteCount = 0;
    song.votes = [];

    if (event.playlist.currentSong == null) {
        event.playlist.currentSong = song;
    } else if (event.playlist.nextSong == null) {
        event.playlist.nextSong = song;
    } else {
        event.playlist.songs.push(song);
    }

    event.save();
}

/**
 * Sort the list of songs using the amcolash algorithm
 *
 * @param   {Song[]}    songs   The list of songs to sort
 * @return  {Song[]}            The sorted list of songs
 */
module.exports.sortSongs = function (songs) {
    return _.sortBy(songs, function (song, index) {
        // Because _.sortBy() sorts in ascending order, we need to negate the
        // songs' scores in order to sort them properly
        var score = (0.75 * (songs.length - index)) + (0.25 * song.voteCount);
        return -1 * score;
    });
}

/**
 * Apply a depreciation function to the voteCount for each song in the playlist
 *
 * @param   {Song[]}    songs   The list of songs to update
 * @return  {Song[]}            The updated list of songs
 */
module.exports.decayVotes = function (songs) {
    return songs.map(function (song) {
        return Math.ceil(0.75 * song.voteCount);
    });
}