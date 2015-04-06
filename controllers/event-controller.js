var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;

module.exports.get = function (req, res) {
	Event.findOne({eventId: req.eventId}, 'settings', function (err, event) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (event === null) {
			logger.warn('Event not found');
			res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			return;
		}

		res.status(status.OK_GET_RESOURCE).send(event);
	});
};

module.exports.put = function (req, res) {
	Event.update({eventId: req.eventId}, {settings: req.body}, function (err) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

module.exports.delete = function (req, res) {
	Event.remove({eventId: req.eventId}, function (err) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};