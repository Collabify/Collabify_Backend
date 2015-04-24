var helpers		= require('./helpers');
var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

/** @module */

function handleLoggedInUser(req, res, user) {
	// Just update their name and settings, but do not modify the eventId or
	// role because these are managed by the database
	if (req.body.name != undefined) {
		user.name = req.body.name;
	}

	if (req.body.settings != undefined) {
		user.settings = req.body.settings;
	}

	user.save();

	res.status(status.OK_UPDATE_RESOURCE).send(user);
}

function handleNewUser(req, res) {
	// Manually add the userId
	req.body.userId = req.headers.userid;

	// Make sure the user isn't linked to an event yet
	req.body.eventId = null;
	req.body.role = 'NoRole';

	User.create(req.body, function (err) {
		if (err) {
			logger.error(err);
			return res.sendStatus(status.ERR_BAD_REQUEST);
		}

		// Return the newly created user
		helpers.getUser(req.body.userId, res, function (user) {
			res.status(status.OK_CREATE_RESOURCE).send(user);
		});
	});
}

/**
 * POST /users/ - Add a user to the database
 *
 * <p>Postconditions: <br>
 * User is logged into the database if they weren't already <br>
 * If the user was already logged in, their details are updated <br>
 *
 * @param 					req 									The client request
 * @param 					req.headers 							The headers in the HTTP request
 * @param {String} 			req.headers.userid 						The user's Spotify ID
 * @param {User}			req.body 								The body of the request - The user to add
 * @param {String} 			req.body.name 							The user's Spotify display name
 * @param {UserSettings} 	req.body.settings 						The user's settings
 * @param {Boolean} 		[req.body.settings.showName=true] 		Whether to display the user's Spotify username or 'anonymous'
 * @param {User}			res 									The server response - The newly added user
 * @param {String} 			res.name 								The user's Spotify display name
 * @param {String}			res.userId								The user's Spotify ID
 * @param {String}			res.eventId								The user's eventId is initially null since the user does not begin at an event
 * @param {String}			res.role								The user's role is initially 'NoRole' since the user does not begin at an event
 * @param {UserSettings} 	res.settings 							The user's settings
 * @param {Boolean} 		res.settings.showName 					Whether to display the user's Spotify username or 'anonymous'
 */
module.exports.post = function (req, res) {
	User.findOne({userId: req.headers.userid}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		if (user != null) {
			handleLoggedInUser(req, res, user);
		} else {
			handleNewUser(req, res);
		}
	});
};