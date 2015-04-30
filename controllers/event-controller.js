var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

/**
 * GET /events/:eventId/ - Get event details
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 *
 * @param                   req                                         The client request
 * @param                   req.headers                                 The headers in the HTTP request
 * @param {String}          req.headers.userid                          The user's Spotify ID
 * @param {Event}           res                                         The server response - The event's details
 * @param {String}          res.name                                    The name of the event
 * @param {String}          res.eventId                                 The ID of the event, equal to the DJ's userId
 * @param {EventSettings}   res.settings                                The settings for the event
 * @param {String}          res.settings.password                       The event password (or null if there isn't one)
 * @param {Boolean}         res.settings.locationRestricted             Whether to restrict the event to nearby users
 * @param {Boolean}         res.settings.allowVoting                    Whether to allow users to vote
 */
module.exports.get = function (req, res) {
    helpers.getUserAtEvent(req.headers.userid, req.eventId, 'name eventId settings', res, function (user, event) {
        res.status(status.OK_GET_RESOURCE).send(event);
    });
};

/**
 * DELETE /events/:eventId/ - End event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * <p>Postconditions: <br>
 * Event is removed from the database <br>
 * Users at the event (including the DJ) have their eventId reset to null <br>
 * Users at the event (including the DJ) have their role reset to 'NoRole' <br>
 *
 * @param   req     The client request
 * @param   res     The server response
 */
module.exports.delete = function (req, res) {
    helpers.endEvent(req.eventId, res, function () {
        res.sendStatus(status.OK_DELETE_RESOURCE);
    });
};