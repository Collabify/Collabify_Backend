var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var helpers 	= require('./helpers');

/** @module */

/**
 * The max distance, in decimal degress, that a user can be from an event and
 * still join it
 */
module.exports.MAX_EVENT_DISTANCE = 5;

/**
 * POST /events/ - Create a new event
 *
 * <p>Preconditions: <br>
 * User has logged in <br>
 * Event does not already exist <br>
 * User is not at an event already <br>
 *
 * <p>Postconditions: <br>
 * Event is created <br>
 * User is assigned the 'DJ' role for the event
 *
 * @param 			req						- The client request
 * @param {String} 	req.headers.userid		- The user's Spotify ID
 * @param {Event} 	req.body				- The event to be created
 * @param 			res						- The server response
 */
module.exports.post = function (req, res) {
	helpers.getUser(req.headers.userid, res, function (user) {
		if (user.eventId == user.userId) {
			logger.error('Event already exists');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		} else if (user.eventId != null) {
			logger.error('User is already at another event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		Event.create(req.body, function (err) {
			if (err) {
				logger.error(err);
				return res.sendStatus(status.ERR_BAD_REQUEST);
			}

			// Because the user is creating the event (they are now a DJ),
			// their eventId should match their userId
			user.role = 'DJ';
			user.eventId = user.userId;
			user.save();

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

/**
 * GET /events/ - Get all events near provided coordinates
 *
 * @param 				req 						- The client request
 * @param {String}		req.headers.latitude		- The user's current latitude
 * @param {String} 		req.headers.longitude		- The user's current longitude
 * @param {Event[]} 	res 						- List of all nearby events
 */
module.exports.get = function (req, res) {
	/** @todo Verify latitude and longitude get converted properly */
	var latitude = Number(req.headers.latitude);
	var longitude = Number(req.headers.longitude);

	Event
		.find()
		.select('name eventId location')
		.where('location')
		.within()
		/** @todo Verify that this is a correct spatial query */
		.circle({
			center: [latitude, longitude],
			radius: module.exports.MAX_EVENT_DISTANCE,
			spherical: true
		})
		.exec(function (err, events) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(events);
		});
};