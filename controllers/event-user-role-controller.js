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
module.exports.put = function (req, res) {
	// First make sure the DJ is the one making the request
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function () {
		// Make sure the affected user is at the event
		helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
			user.role = req.body;
			res.sendStatus(status.OK_UPDATE_RESOURCE);
		});
	});
};