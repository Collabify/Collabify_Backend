var helpers			= require('./helpers');
var CollabifyError	= require('../collabify-error');
var status			= require('../status');

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
 * @param 			req.body 				The body of the request
 * @param {String} 	req.body.role 			The new role for the affected user
 * @param 			res 					The server response
 * @param {String}	res.role				The new role for the affected user
 */
module.exports.put = function (req, res) {
	// Make sure the affected user is at the event
	helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
		if (user.role == 'DJ') {
			return new CollabifyError(status.ERR_BAD_REQUEST,
									  'DJ cannot have their role changed').send(res);
		} else if (req.body.role == 'DJ') {
			return new CollabifyError(status.ERR_BAD_REQUEST,
									  'Cannot promote user to DJ').send(res);
		} else if (req.body.role != 'Collabifier'
				   && req.body.role != 'Promoted'
				   && req.body.role != 'Blacklisted') {
			return new CollabifyError(status.ERR_BAD_REQUEST, 'Invalid role').send(res);
		}

		user.role = req.body.role;
		user.save();

		res.status(status.OK_UPDATE_RESOURCE).send({role: user.role});
	});
};