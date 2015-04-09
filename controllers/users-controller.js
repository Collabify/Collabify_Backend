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
	User.findOne({userId: req.headers.userid}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user != null && user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		if (user != null) {
			// User already logged in, just update their name and settings but
			// do not modify the eventId or role because these are managed by
			// the database
			if (req.body.name != undefined) {
				user.name = req.body.name;
			}

			if (req.body.name != undefined) {
				user.settings = req.body.settings;
			}

			user.save();

			res.sendStatus(status.OK_UPDATE_RESOURCE);
		} else {
			// Manually add the userId
			req.body.userId = req.headers.userid;

			// Make sure the user isn't linked to an event yet
			req.body.eventId = null;

			User.create(req.body, function (err) {
				if (err) {
					logger.error(err);
					return res.sendStatus(status.ERR_BAD_REQUEST);
				}

				res.sendStatus(status.OK_CREATE_RESOURCE);
			});
		}
	});
};