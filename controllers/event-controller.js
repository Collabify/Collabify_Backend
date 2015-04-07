var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User		= require('../models/user').User;

module.exports.get = function (req, res) {
	Event.findOne({eventId: req.eventId}, 'settings', function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event === null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		res.status(status.OK_GET_RESOURCE).send(event);
	});
};

module.exports.put = function (req, res) {
	Event.update({eventId: req.eventId}, {settings: req.body.settings}, function (err) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

module.exports.delete = function (req, res) {
	Event.findOne({eventId: req.eventId}, function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event == null) {
			logger.error('Event not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		// Remove users from the event
		User.update({userId: {$in: event.userIds}}, {eventId: null}, function (err) {
			if (err) {
				return status.handleUnexpectedError(err, res);
			}

			// End the event
			event.remove();

			res.sendStatus(status.OK_DELETE_RESOURCE);
		});
	});
};