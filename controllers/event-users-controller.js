var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User 		= require('../models/user').User;

module.exports.post = function (req, res) {
	User.findOne({userId: req.body.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user === null) {
			logger.error("User hasn't logged in");
			return res.sendStatus(status.ERR_UNAUTHORIZED);
		} else if (user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		Event.findOne({eventId: req.eventId}, function (err, event) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (event == null) {
				logger.error('Event not found');
				return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			}

			user.eventId = req.eventId;
			user.save();

			event.userIds.push(req.body.userId);
			event.save();

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

module.exports.get = function (req, res) {
	/** @todo Return data within object property */
	Event.findOne({eventId: req.eventId}, 'userIds', function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};