var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;
var helpers		= require('./helpers');

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

			event.userIds.push(req.body.userId);
			event.save();

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};

module.exports.get = function (req, res) {
	// First, make sure the DJ is the one making the request
	helpers.getEventAsDJ(req.headers.userid, req.eventId, function (event) {
		// Find all users at the event
		User.find({userId: {$in: event.userIds}}, 'name userId role', function (err, users) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			res.status(status.OK_GET_RESOURCE).send(users);
		});
	});
};