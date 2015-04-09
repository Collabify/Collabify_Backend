var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

/** @module */

/**
 * DELETE /events/:eventId/users/:userId - Leave event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is at the event <br>
 * User is not the DJ for the event <br>
 *
 * <p>Postconditions: <br>
 * User is removed from the list of users at the event <br>
 * User's eventId is reset to null <br>
 * User's role is reset to 'NoRole' <br>
 *
 * @param 			req 					The client request
 * @param 			req.headers 			The headers in the HTTP request
 * @param {String} 	req.headers.userid 		The user's Spotify ID
 * @param 			res 					The server response
 */
module.exports.delete = function (req, res) {
	helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
		if (user.role == 'DJ') {
			logger.error('DJ cannot leave event');
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		}

		var userIdIndex = event.userIds.indexOf(user.userId);

		if (userIdIndex == -1) {
			logger.error('User not at event');
			return res.sendStatus(status.ERR_BAD_REQUEST);
		}

		// Remove the user from the event
		event.userIds.splice(userIdIndex, 1);
		event.save();

		user.eventId = null;
		user.role = 'NoRole';
		user.save();

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};