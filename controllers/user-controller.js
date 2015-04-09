var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

/** @module */

/**
 *
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 *
 * @param req The client request
 * @param req.headers The headers in the HTTP request
 * @param {String} req.headers.userid The user's Spotify ID
 * @param req.body The body of the request
 * @param res The server response
 */
module.exports.get = function (req, res) {
	helpers.getUser(req.userId, 'name userId eventId role settings', res, function (user) {
		res.status(status.OK_GET_RESOURCE).send(user);
	});
};

/**
 *
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 *
 * @param req The client request
 * @param req.headers The headers in the HTTP request
 * @param {String} req.headers.userid The user's Spotify ID
 * @param req.body The body of the request
 * @param res The server response
 */
module.exports.put = function (req, res) {
	helpers.getUser(req.userId, res, function (user) {
		user.settings = req.body;
		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

/**
 *
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 *
 * @param req The client request
 * @param req.headers The headers in the HTTP request
 * @param {String} req.headers.userid The user's Spotify ID
 * @param req.body The body of the request
 * @param res The server response
 */
module.exports.delete = function (req, res) {
	helpers.getUser(req.userId, res, function (user) {
		// Before logging out the user, remove them from their event if they were
		// at one
		if (user.eventId != null) {
			helpers.getEvent(user.eventId, res, function (event) {
				var userIdIndex = event.userIds.indexOf(user.userId);

				if (userIdIndex == -1) {
					logger.error('User not at event');
					return res.sendStatus(status.ERR_BAD_REQUEST);
				}

				// Remove the user from the event
				event.userIds.splice(userIdIndex, 1);
				event.save();
			});
		}

		// Log out the user
		user.remove();

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};