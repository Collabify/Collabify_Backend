var status		= require('../status');
var User		= require('../models/user').User;
var helpers 	= require('./helpers');

/** @module */

/**
 * GET /events/:eventId/ - Get current settings for the event
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * @param 					req 						The client request
 * @param					req.headers					The headers in the HTTP request
 * @param {String} 			req.headers.userid 			The user's Spotify ID
 * @param {EventSettings} 	res 						The server response - The current event settings
 * @param {String}			res.password				The event password (or null if there isn't one)
 * @param {Boolean}			res.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}			res.allowVoting				Whether to allow users to vote on songs
 */
module.exports.get = function (req, res) {
	helpers.getDJUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		res.status(status.OK_GET_RESOURCE).send(event.settings);
	});
};

/**
 * PUT /events/:eventId/ - Change settings for the event
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
 * @param					req.headers						The headers in the HTTP request
 * @param {String} 			req.headers.userid 				The user's Spotify ID
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
	helpers.getDJUserAtEvent(req.headers.userid, req.eventId, res, function (user, event) {
		event.settings = req.body;
		event.save();

		res.status(status.OK_UPDATE_RESOURCE).send(event.settings);
	});
};

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
 * @param 				req 					The client request
 * @param 				req.headers 			The headers in the HTTP request
 * @param {String} 		req.headers.userid 		The user's Spotify ID
 * @param 				res 					The server response
 */
module.exports.delete = function (req, res) {
	helpers.endEvent(req.headers.userid, req.eventId, res, function () {
		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};