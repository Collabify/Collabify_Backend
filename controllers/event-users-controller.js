var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;
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
module.exports.post = function (req, res) {
	helpers.getUser(req.headers.userid, res, function (user) {
		if (user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		helpers.getEvent(req.eventId, res, function (event) {
			user.role = 'Collabifier';
			user.eventId = req.eventId;
			user.save();

			event.userIds.push(user.userId);
			event.save();

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

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
module.exports.get = function (req, res) {
	// First, make sure the DJ is the one making the request
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		// Find all users at the event
		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};