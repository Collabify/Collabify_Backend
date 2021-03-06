var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');
var Event           = require('../models/event').Event;

/** @module */

/**
 * The max distance, in decimal degress, that a user can be from an event and
 * still join it
 */
module.exports.MAX_EVENT_DISTANCE = 0.1;

/**
 * POST /events/ - Create a new event
 *
 * <p>Preconditions: <br>
 * Event does not already exist <br>
 * User has logged in <br>
 * User is not at an event already <br>
 *
 * <p>Postconditions: <br>
 * Event is created <br>
 * User is assigned the 'DJ' role for the event <br>
 *
 * @param                       req                                             The client request
 * @param                       req.headers                                     The headers in the HTTP request
 * @param {String}              req.headers.userid                              The user's Spotify ID
 * @param {Event}               req.body                                        The body of the request - The event to be created
 * @param {String}              req.body.name                                   The name of the event
 * @param {Location}            req.body.location                               The location of the event
 * @param {Number}              req.body.location.latitude                      The latitude of the event
 * @param {Number}              req.body.location.longitude                     The longitude of the event
 * @param {EventSettings}       req.body.settings                               The settings for the event
 * @param {String}              [req.body.settings.password=null]               The event password (or null if there isn't one)
 * @param {Boolean}             [req.body.settings.locationRestricted=true]     Whether to restrict the event to nearby users
 * @param {Boolean}             [req.body.settings.allowVoting=true]            Whether to allow users to vote on songs
 * @param {Event}               res                                             The server response - The newly created event
 * @param {String}              res.name                                        The name of the event
 * @param {String}              res.eventId                                     The ID of the event, equal to the DJ's userId
 * @param {String[]}            res.userIds                                     The event initially has no users attending
 * @param {Location}            res.location                                    The location of the event
 * @param {Number}              res.location.latitude                           The latitude of the event
 * @param {Number}              res.location.longitude                          The longitude of the event
 * @param {Playlist}            res.playlist                                    The event's playlist, which is initially empty
 * @param {Song}                res.playlist.currentSong                        The currently playing song, initially null
 * @param {String}              res.playlist.currentSong.title                  The title of the song
 * @param {String}              res.playlist.currentSong.artist                 The name of the artist
 * @param {String}              res.playlist.currentSong.album                  The name of the album the song appears on
 * @param {Number}              res.playlist.currentSong.year                   The year the song was released
 * @param {String}              res.playlist.currentSong.songId                 The Spotify ID for the song
 * @param {String}              res.playlist.currentSong.artworkUrl             The URL where the album art can be found
 * @param {String}              res.playlist.currentSong.userId                 The Spotify ID of the user who added the song
 * @param {Number}              res.playlist.currentSong.voteCount              The song's current number of (upvotes - downvotes)
 * @param {Vote}                res.playlist.currentSong.vote                   The vote placed by the user for the song
 * @param {Boolean}             res.playlist.currentSong.vote.isUpvoted         Whether the user upvoted the song
 * @param {Boolean}             res.playlist.currentSong.vote.isDownvoted       Whether the user downvoted the song
 * @param {Song}                res.playlist.nextSong                           The next song to be played, initially null
 * @param {String}              res.playlist.nextSong.title                     The title of the song
 * @param {String}              res.playlist.nextSong.artist                    The name of the artist
 * @param {String}              res.playlist.nextSong.album                     The name of the album the song appears on
 * @param {Number}              res.playlist.nextSong.year                      The year the song was released
 * @param {String}              res.playlist.nextSong.songId                    The Spotify ID for the song
 * @param {String}              res.playlist.nextSong.artworkUrl                The URL where the album art can be found
 * @param {String}              res.playlist.nextSong.userId                    The Spotify ID of the user who added the song
 * @param {Number}              res.playlist.nextSong.voteCount                 The song's current number of (upvotes - downvotes)
 * @param {Vote}                res.playlist.nextSong.vote                      The vote placed by the user for the song
 * @param {Boolean}             res.playlist.nextSong.vote.isUpvoted            Whether the user upvoted the song
 * @param {Boolean}             res.playlist.nextSong.vote.isDownvoted          Whether the user downvoted the song
 * @param {Song[]}              res.playlist.songs                              The playlist's list of songs, initially empty
 * @param {String}              res.playlist.songs[].title                      The title of the song
 * @param {String}              res.playlist.songs[].artist                     The name of the artist
 * @param {String}              res.playlist.songs[].album                      The name of the album the song appears on
 * @param {Number}              res.playlist.songs[].year                       The year the song was released
 * @param {String}              res.playlist.songs[].songId                     The Spotify ID for the song
 * @param {String}              res.playlist.songs[].artworkUrl                 The URL where the album art can be found
 * @param {String}              res.playlist.songs[].userId                     The Spotify ID of the user who added the song
 * @param {Number}              res.playlist.songs[].voteCount                  The song's current number of (upvotes - downvotes)
 * @param {Vote}                res.playlist.songs[].vote                       The vote placed by the user for the song
 * @param {Boolean}             res.playlist.songs[].vote.isUpvoted             Whether the user upvoted the song
 * @param {Boolean}             res.playlist.songs[].vote.isDownvoted           Whether the user downvoted the song
 * @param {EventSettings}       res.settings                                    The settings for the event
 * @param {String}              res.settings.password                           The event password (or null if there isn't one)
 * @param {Boolean}             res.settings.locationRestricted                 Whether to restrict the event to nearby users
 * @param {Boolean}             res.settings.allowVoting                        Whether to allow users to vote on songs
 */
module.exports.post = function (req, res) {
    helpers.getUser(req.headers.userid, res, function (user) {
        if (user.eventId == user.userId) {
            return new CollabifyError(status.ERR_RESOURCE_EXISTS, 'Event already exists').send(res);
        } else if (user.eventId != null) {
            return new CollabifyError(status.ERR_RESOURCE_EXISTS,
                                      'User is already at another event').send(res);
        }

        // Manually fill in the eventId
        req.body.eventId = user.userId;

        Event.create(req.body, function (err) {
            if (err) {
                return new CollabifyError(status.ERR_BAD_REQUEST,
                                          'Unexpected error while creating event').send(res);
            }

            // Because the user is creating the event (they are now a DJ),
            // their eventId should match their userId
            user.role = 'DJ';
            user.eventId = user.userId;
            user.save();

            // Return the newly created event
            helpers.getEvent(req.body.eventId, res, function (event) {
                res.status(status.OK_CREATE_RESOURCE).send(event);
            });
        });
    });
};

/**
 * GET /events/ - Get all events near provided coordinates
 *
 * @param                       req                                     The client request
 * @param                       req.headers                             The headers in the HTTP request
 * @param {String}              req.headers.latitude                    The user's current latitude
 * @param {String}              req.headers.longitude                   The user's current longitude
 * @param {Event[]}             res                                     The server response - A list of all nearby events
 * @param {String}              res[].name                              The event's name
 * @param {String}              res[].eventId                           The Spotify ID for the user who created the event
 * @param {Location}            res[].location                          The location of the event
 * @param {String}              res[].location.latitude                 The latitude of the event
 * @param {String}              res[].location.longitude                The longitude of the event
 * @param {EventSettings}       res[].settings                          The settings for the event
 * @param {String}              res[].settings.password                 The event password (or null if there isn't one)
 * @param {Boolean}             res[].settings.locationRestricted       Whether to restrict the event to nearby users
 * @param {Boolean}             res[].settings.allowVoting              Whether to allow users to vote on songs
 */
module.exports.get = function (req, res) {
    var latitude = Number(req.headers.latitude);
    var longitude = Number(req.headers.longitude);

    /** @todo Implement the spatial query correctly */
    Event
        .find()
        .select('name eventId location settings')
        .where('location')
        .within()
        .circle({
            center: [latitude, longitude],
            radius: module.exports.MAX_EVENT_DISTANCE
        })
        .exec(function (err, events) {
            if (err) {
                return new CollabifyError(status.ERR_BAD_REQUEST,
                                          'Unexpected error while querying for nearby events').send(res);
            }

            res.status(status.OK_GET_RESOURCE).send(events);
        });
};