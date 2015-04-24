var helpers 	= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');

/** @module */

/**
 * GET /events/:eventId/settings/ - Get current settings for the event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * @param 					req 						The client request
 * @param {EventSettings} 	res 						The server response - The current event settings
 * @param {String}			res.password				The event password (or null if there isn't one)
 * @param {Boolean}			res.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}			res.allowVoting				Whether to allow users to vote on songs
 */
module.exports.get = function (req, res) {
	helpers.getDJUserAtEvent(req.eventId, res, function (user, event) {
		res.status(status.OK_GET_RESOURCE).send(event.settings);
	});
};

/**
 * PUT /events/:eventId/settings/ - Change settings for the event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * <p>Postconditions: <br>
 * The event's settings are updated <br>
 *
 * @param 					req 							The client request
 * @param {EventSettings}	req.body 						The body of the request - The new event settings
 * @param {String}			req.body.password				The password for the event, or null if there isn't one
 * @param {Boolean}			req.body.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}			req.body.allowVoting			Whether to allow users to vote on songs
 * @param {EventSettings}	res 							The server response - The new event settings
 * @param {String}			res.password					The password for the event, or null if there isn't one
 * @param {Boolean}			res.locationRestricted			Whether to restrict the event to nearby users
 * @param {Boolean}			res.allowVoting					Whether to allow users to vote on songs
 */
module.exports.put = function (req, res) {
	helpers.getDJUserAtEvent(req.eventId, res, function (user, event) {
		event.settings = req.body;
		event.save();

		res.status(status.OK_UPDATE_RESOURCE).send(event.settings);
	});
};