var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;
var User 		= require('../models/user').User;

module.exports.delete = function (req, res) {
	User.findOne({userId: req.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.error('User not found');
			return res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
		} else if (user.eventId != req.eventId) {
			logger.error('User not at event');
			return res.sendStatus(status.ERR_BAD_REQUEST);
		}

		Event.findOne({eventId: req.eventId}, function (err, event) {
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

			user.eventId = null;
			user.save();

			res.sendStatus(status.OK_DELETE_RESOURCE);
		});
	});
};