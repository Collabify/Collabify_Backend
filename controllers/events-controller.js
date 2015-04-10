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
 * Event does not already exist <br>
 * User has logged in <br>
 * User is not at an event already <br>
 *
 * <p>Postconditions: <br>
 * Event is created <br>
 * User is assigned the 'DJ' role for the event <br>
 *
 * @param 						req												The client request
 * @param						req.headers										The headers in the HTTP request
 * @param {String} 				req.headers.userid								The user's Spotify ID
 * @param						req.body										The body of the request
 * @param {String} 				req.body.name									The name of the event
 * @param {Location}			req.body.location								The location of the event
 * @param {Number}				req.body.location.latitude						The latitude of the event
 * @param {Number}				req.body.location.longitude						The longitude of the event
 * @param {EventSettings}		req.body.settings								The settings for the event
 * @param {String}				[req.body.settings.password=null]				The event password (or null if there isn't one)
 * @param {Boolean}				[req.body.settings.locationRestricted=true]		Whether to restrict the event to nearby users
 * @param {Boolean}				[req.body.settings.allowVoting=true]			Whether to allow users to vote on songs
 * @param 						res												The server response
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

		// Manually fill in the eventId
		req.body.eventId = user.userId;

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
 * @param 						req 									The client request
 * @param						req.headers								The headers in the HTTP request
 * @param {String}				req.headers.latitude					The user's current latitude
 * @param {String} 				req.headers.longitude					The user's current longitude
 * @param 						res 									The server response
 * @param {String}				res[i].name								The event's name
 * @param {String}				res[i].eventId							The Spotify ID for the user who created the event
 * @param {Location}			res[i].location							The location of the event
 * @param {String}				res[i].location.latitude				The latitude of the event
 * @param {String}				res[i].location.longitude				The longitude of the event
 * @param {EventSettings}		res[i].settings							The settings for the event
 * @param {String}				res[i].settings.password				The event password (or null if there isn't one)
 * @param {Boolean}				res[i].settings.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}				res[i].settings.allowVoting				Whether to allow users to vote on songs
 */
module.exports.get = function (req, res) {
	var latitude = Number(req.headers.latitude);
	var longitude = Number(req.headers.longitude);

	/** @todo Implement the spatial query correctly */
	Event
		.find()
		.select('name eventId location settings')
		.where('location')
		.within()
		.circle({
			center: [latitude, longitude],
			radius: module.exports.MAX_EVENT_DISTANCE
		})
		.exec(function (err, events) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(events);
		});
};