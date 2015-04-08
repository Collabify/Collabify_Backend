var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;

/** @module */

/**
 * The max distance, in decimal degress, that a user can be from an event and
 * still join it
 */
module.exports.MAX_EVENT_DISTANCE = 10;

/**
 * POST /events/ - Create a new event
 *
 * @param 			req				- The client request
 * @param {Event} 	req.body.event	- The event to be created
 * @param 			res				- The server response
 */
module.exports.post = function (req, res) {
	User.findOne({userId: req.body.event.eventId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		} else if (user.eventId == user.userId) {
			logger.error('Event already exists');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		} else if (user.eventId != null) {
			logger.error('User is already at another event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		Event.create(req.body.event, function (err) {
			if (err) {
				logger.error(err);
				return res.sendStatus(status.ERR_BAD_REQUEST);
			}

			// Because the user is creating the event (they are the DJ), their
			// eventId should match their userId
			user.eventId = user.userId;
			user.save();

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

/**
 * GET /events/ - Get all events near provided coordinates
 *
 * @param 				req 				- The client request
 * @param {Location} 	req.body.location 	- The user's current latitude and longitude coordinates
 * @param {Event[]} 	res 				- List of all nearby events
 */
module.exports.get = function (req, res) {
	/** @todo Check req.body.location for undefined */
	Event
	.find()
	.select('name eventId location')
	.where('location')
	.within()
	.circle({
		center: [req.body.location.latitude, req.body.location.longitude],
		radius: module.exports.MAX_EVENT_DISTANCE
	})
	.exec(function (err, events) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (events.length == 0) {
			logger.warn('No nearby events');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		res.status(status.OK_GET_RESOURCE).send(events);
	});
};