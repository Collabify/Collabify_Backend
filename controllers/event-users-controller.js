var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;
var helpers		= require('./helpers');

/** @module */

/**
 * POST /events/:eventId/users/ - Join event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is not at another event <br>
 *
 * <p>Postconditions: <br>
 * User is added to the event's user list if they weren't already <br>
 * User's eventId is changed to match the event if they weren't already at the event <br>
 * User's role is changed to 'Collabifier' if they weren't already at the event <br>
 *
 * @param 					req 						The client request
 * @param 					req.headers 				The headers in the HTTP request
 * @param {String} 			req.headers.userid 			The user's Spotify ID
 * @param {User}			res 						The server response - The user who joined the event
 * @param {String} 			res.name 					The user's Spotify display name
 * @param {String} 			res.userId 					The user's Spotify ID
 * @param {String}			res.eventId					The ID of the event that the user just joined
 * @param {String}			res.role					The user defaults to a Collabifier
 * @param {UserSettings} 	res.settings 				The user's settings
 * @param {Boolean} 		res.settings.showName 		Whether to display the user's Spotify username or 'anonymous'
 *
 */
module.exports.post = function (req, res) {
	helpers.getUser(req.headers.userid, res, function (user) {
		if (user.eventId == req.eventId) {
			// Nothing to do, the user is already at the event
			return res.status(status.OK_CREATE_RESOURCE).send(user);
		} else if (user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		helpers.getEvent(req.eventId, res, function (event) {
			user.role = 'Collabifier';
			user.eventId = req.eventId;
			user.save();

			event.userIds.push(user.userId);
			event.save();

			res.status(status.OK_CREATE_RESOURCE).send(user);
		});
	});
};

/**
 * GET /events/:eventId/users/ - Get list of users at event (not including the DJ)
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * @param 			req 					The client request
 * @param 			req.headers 			The headers in the HTTP request
 * @param {String} 	req.headers.userid 		The user's Spotify ID
 * @param {User[]}	res 					The server response - The list of users at the event not including the DJ
 * @param {String}	res[].name				The user's name
 * @param {String}	res[].userId			The user's Spotify ID
 * @param {String}	res[].role				The user's role
 */
module.exports.get = function (req, res) {
	// First, make sure the DJ is the one making the request
	helpers.getDJUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		// Find all users at the event
		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};