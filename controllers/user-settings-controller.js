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
 *
 * @param                   req                     The client request
 * @param {UserSettings}    req.body                The body of the request - The new user settings
 * @param {String}          req.body.showName       Whether to display the user's Spotify username or 'anonymous'
 * @param {UserSettings}    res                     The server response - The new user settings
 * @param {String}          res.showName            Whether to display the user's Spotify username or 'anonymous'
 */
module.exports.put = function (req, res) {
    helpers.getUser(req.userId, res, function (user) {
        user.settings = req.body;
        user.save();

        res.status(status.OK_UPDATE_RESOURCE).send(user.settings);
    });
};