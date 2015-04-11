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
 * @param {Event}				req.body										The body of the request - The event to be created
 * @param {String} 				req.body.name									The name of the event
 * @param {Location}			req.body.location								The location of the event
 * @param {Number}				req.body.location.latitude						The latitude of the event
 * @param {Number}				req.body.location.longitude						The longitude of the event
 * @param {EventSettings}		req.body.settings								The settings for the event
 * @param {String}				[req.body.settings.password=null]				The event password (or null if there isn't one)
 * @param {Boolean}				[req.body.settings.locationRestricted=true]		Whether to restrict the event to nearby users
 * @param {Boolean}				[req.body.settings.allowVoting=true]			Whether to allow users to vote on songs
 * @param {Event}				res												The server response - The newly created event
 * @param {String} 				res.name										The name of the event
 * @param {String}				res.eventId										The ID of the event, equal to the DJ's userId
 * @param {String[]}			res.userIds										The event initially has no users attending
 * @param {Location}			res.location									The location of the event
 * @param {Number}				res.location.latitude							The latitude of the event
 * @param {Number}				res.location.longitude							The longitude of the event
 * @param {Playlist}			res.playlist									The playlist for the event
 * @param {Song[]}				res.playlist.songs								The playlist is initially empty
 * @param {EventSettings}		res.settings									The settings for the event
 * @param {String}				res.settings.password							The event password (or null if there isn't one)
 * @param {Boolean}				res.settings.locationRestricted					Whether to restrict the event to nearby users
 * @param {Boolean}				res.settings.allowVoting						Whether to allow users to vote on songs
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

			// Return the newly created event
			helpers.getEvent(req.body.eventId, res, function (event) {
				res.status(status.OK_CREATE_RESOURCE).send(event);
			});
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
 * @param {Event[]}				res 									The server response - A list of all nearby events
 * @param {String}				res[].name								The event's name
 * @param {String}				res[].eventId							The Spotify ID for the user who created the event
 * @param {Location}			res[].location							The location of the event
 * @param {String}				res[].location.latitude					The latitude of the event
 * @param {String}				res[].location.longitude				The longitude of the event
 * @param {EventSettings}		res[].settings							The settings for the event
 * @param {String}				res[].settings.password					The event password (or null if there isn't one)
 * @param {Boolean}				res[].settings.locationRestricted		Whether to restrict the event to nearby users
 * @param {Boolean}				res[].settings.allowVoting				Whether to allow users to vote on songs
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