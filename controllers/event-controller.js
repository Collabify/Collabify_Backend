var helpers 	= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');

/** @module */

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
 * @param 	req 	The client request
 * @param 	res 	The server response
 */
module.exports.delete = function (req, res) {
	helpers.endEvent(req.eventId, res, function () {
		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};