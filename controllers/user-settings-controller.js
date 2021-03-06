var helpers         = require('./helpers');
var CollabifyError  = require('../collabify-error');
var status          = require('../status');

/** @module */

/**
 * PUT /users/:userId/settings/ - Change user settings
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 * User's settings are updated
 * User's songs in their current event are updated based on the 'showName' field
 *
 * @param                   req                     The client request
 * @param {UserSettings}    req.body                The body of the request - The new user settings
 * @param {Boolean}         req.body.showName       Whether to display the user's Spotify username or 'anonymous'
 * @param {UserSettings}    res                     The server response - The new user settings
 * @param {Boolean}         res.showName            Whether to display the user's Spotify username or 'anonymous'
 */
module.exports.put = function (req, res) {
    helpers.getUser(req.userId, res, function (user) {
        user.settings = req.body;
        user.save();

        if (user.eventId != null) {
            // Update all songs added by the user in their current event based
            // on the updated showName setting
            helpers.getEvent(user.eventId, res, function (event) {
                helpers.setUsernameForSongs(user, event);
                res.status(status.OK_UPDATE_RESOURCE).send(user.settings);
            });
        } else {
            // User isn't part of an event; no need to do anything
            res.status(status.OK_UPDATE_RESOURCE).send(user.settings);
        }
    });
};
