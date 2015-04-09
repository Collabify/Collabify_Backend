var status		= require('../status');
var User		= require('../models/user').User;
var helpers 	= require('./helpers');

module.exports.get = function (req, res) {
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		res.status(status.OK_GET_RESOURCE).send(event.settings);
	});
};

module.exports.put = function (req, res) {
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
		event.settings = req.body;
		event.save();

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

module.exports.delete = function (req, res) {
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function (event) {
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