var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

/** @module */

/**
 * GET /users/:userId/ - Get user details
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * @param 					req 						The client request
 * @param 					res 						The server response
 * @param {String} 			res.name 					The user's name
 * @param {String} 			res.userId 					The user's Spotify ID
 * @param {String} 			res.eventId 				The ID of the event the user is at, or null if they aren't at one
 * @param {String} 			res.role 					The user's role
 * @param {UserSettings} 	res.settings 				The user's current settings
 * @param {Boolean} 		res.settings.showName		Whether to display the user's Spotify username or 'anonymous'
 */
module.exports.get = function (req, res) {
	helpers.getUser(req.userId, 'name userId eventId role settings', res, function (user) {
		res.status(status.OK_GET_RESOURCE).send(user);
	});
};

/**
 * PUT /users/:userId/ - Change user settings
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 * User's settings are updated
 *
 * @param 				req 					The client request
 * @param 				req.body 				The body of the request
 * @param {String} 		req.body.showName 		Whether to display the user's Spotify username or 'anonymous'
 * @param 				res 					The server response
 */
module.exports.put = function (req, res) {
	helpers.getUser(req.userId, res, function (user) {
		user.settings = req.body;
		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

/**
 * DELETE /users/:userId/ - Log out the user and delete them from the database
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 *
 * <p>Postconditions: <br>
 * User is removed from the database <br>
 * If the user was a DJ for an event, the event is ended <br>
 * If the user was at an event, they are removed from the event's user list <br>
 *
 * @param req The client request
 * @param res The server response
 */
module.exports.delete = function (req, res) {
	helpers.getUser(req.userId, res, function (user) {
		var logOut = function () {
			user.remove();
			res.sendStatus(status.OK_DELETE_RESOURCE);
		}

		if (user.eventId != null) {
			if (user.role == 'DJ') {
				return helpers.endEvent(user.userId, user.eventId, res, logOut);
			} else {
				return helpers.leaveEvent(user.userId, user.eventId, res, logOut);
			}
		}

		logOut();
	});
};