var helpers		= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');

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
 * @param 	req		The client request
 * @param 	res 	The server response
 */
module.exports.delete = function (req, res) {
	helpers.leaveEvent(req.userId, req.eventId, res, function () {
		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};