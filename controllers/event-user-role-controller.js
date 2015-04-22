var logger		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

/** @module */

/**
 * PUT /events/:eventId/users/:userId/role/ - Change user's role
 *
 * <p>Preconditions: <br>
 * Event exists <br>
 * Requesting user has logged in <br>
 * Requesting user is the DJ or a Promoted Collabifier <br>
 * Affected user is at the event <br>
 * Affected user is not the DJ <br>
 * New role is not 'DJ' <br>
 *
 * <p>Postconditions: <br>
 * Affected user has their role changed <br>
 *
 * @param 			req 					The client request
 * @param 			req.headers 			The headers in the HTTP request
 * @param {String} 	req.headers.userid 		The requestig user's Spotify ID
 * @param 			req.body 				The body of the request
 * @param {String} 	req.body.role 			The new role for the affected user
 * @param 			res 					The server response
 * @param {String}	res.role				The new role for the affected user
 */
module.exports.put = function (req, res) {
	// First make sure the DJ is the one making the request
	helpers.getDJUserAtEvent(req.headers.userid, req.eventId, res, function () {
		// Make sure the affected user is at the event
		helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
			if (user.role == 'DJ') {
				logger.error('DJ cannot have their role changed');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			} else if (req.body.role == 'DJ') {
				logger.error('Cannot promote user to DJ');
				return res.sendStatus(status.ERR_UNAUTHORIZED);
			} else if (req.body.role != 'Collabifier'
					   && req.body.role != 'Promoted'
					   && req.body.role != 'Blacklisted') {
				logger.error('Invalid role');
				return res.sendStatus(status.ERR_BAD_REQUEST);
			}

			user.role = req.body.role;
			user.save();

			res.status(status.OK_UPDATE_RESOURCE).send({role: user.role});
		});
	});
};