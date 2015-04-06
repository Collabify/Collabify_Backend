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
			res.sendStatus(status.ERR_UNAUTHORIZED);
			return;
		} else if (user.eventId != null) {
			logger.error('User is already at an event');
			res.sendStatus(status.ERR_RESOURCE_EXISTS);
			return;
		}

		Event.findOne({eventId: req.eventId}, function (err, event) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (event == null) {
				logger.error('Event does not exist');
				res.sendStatus(status.ERR_BAD_REQUEST);
				return;
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
	Event.findOne({eventId: req.eventId}, 'userIds', function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event does not exist');
			res.sendStatus(status.ERR_BAD_REQUEST);
			return;
		}

		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			} else if (users.length == 0) {
				logger.warn('No users at event');
				res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
				return;
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};