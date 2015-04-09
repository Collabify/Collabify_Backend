var status		= require('../status');
var User		= require('../models/user').User;
var helpers 	= require('./helpers');

/** @module */

/**
 * GET /events/:eventId/ - Get current settings for the event
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * @param 					req 						The client request
 * @param					req.headers					The headers in the HTTP request
 * @param {String} 			req.headers.userid 			The user's Spotify ID
 * @param 				 	res 						The server response
 * @param {String}			res.password				The event password (or null if there isn't one)
 * @param {Boolean}			res.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}			res.allowVoting				Whether to allow users to vote on songs
 */
module.exports.get = function (req, res) {
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		res.status(status.OK_GET_RESOURCE).send(event.settings);
	});
};

/**
 * PUT /events/:eventId/ - Change settings for the event
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 * User is the DJ for the requested event <br>
 *
 * <p>Postconditions: <br>
 * The event's settings are updated <br>
 *
 * @param 				req 							The client request
 * @param				req.headers						The headers in the HTTP request
 * @param {String} 		req.headers.userid 				The user's Spotify ID
 * @param 				req.body 						The body of the request
 * @param {String}		req.body.password				The password for the event, or null if there isn't one
 * @param {Boolean}		req.body.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}		req.body.allowVoting			Whether to allow users to vote on songs
 * @param 				res 							The server response
 */
module.exports.put = function (req, res) {
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		event.settings = req.body;
		event.save();

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

/**
 * DELETE /events/:eventId/ - End event
 *
 * <p>Preconditions: <br>
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
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		// Remove users from the event
		User.update({userId: {$in: event.userIds}}, {eventId: null, role: 'NoRole'}, function (err) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			// End the event
			event.remove();

			// Update the DJ
			helpers.getUser(req.headers.userid, res, function (user) {
				user.eventId = null;
				user.role = 'NoRole';
				user.save();
			});

			res.sendStatus(status.OK_DELETE_RESOURCE);
		});
	});
};