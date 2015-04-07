var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

module.exports.get = function (req, res) {
	User.findOne({userId: req.userId}, 'name userId eventId role settings', function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		res.status(status.OK_GET_RESOURCE).send(user);
	});
};

module.exports.put = function (req, res) {
	User.update({userId: req.userId}, {settings: req.body.settings}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};

module.exports.delete = function (req, res) {
	User.findOne({userId: req.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		}

		// Before logging out the user, remove them from their event if they were
		// at one
		if (user.eventId != null) {
			Event.findOne({eventId: user.eventId}, function (err, event) {
				if (err) {
					return status.handleUnexpectedError(err, res);
				} else if (event == null) {
					logger.error('Event not found');
					return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
				}

				var userIdIndex = event.userIds.indexOf(user.userId);

				if (userIdIndex == -1) {
					logger.error('User not at event');
					return res.sendStatus(status.ERR_BAD_REQUEST);
				}

				// Remove the user from the event
				event.userIds.splice(userIdIndex, 1);
				event.save();
			});
		}

		// Log out the user
		user.remove();

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};