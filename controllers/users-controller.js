var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;
var helpers		= require('./helpers');

module.exports.post = function (req, res) {
	User.findOne({userId: req.headers.userid}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user != null && user.eventId != null) {
			logger.error('User is already at an event');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		if (user != null) {
			// User already logged in, just update their name and settings but
			// do not modify the eventId or role because these are managed by
			// the database
			user.name = req.body.name;
			user.settings = req.body.settings;
			user.save();

			res.sendStatus(status.OK_UPDATE_RESOURCE);
		} else {
			// Manually add the userId
			req.body.userId = req.headers.userid;

			User.create(req.body, function (err) {
				if (err) {
					logger.error(err);
					return res.sendStatus(status.ERR_BAD_REQUEST);
				}

				res.sendStatus(status.OK_CREATE_RESOURCE);
			});
		}
	});
};