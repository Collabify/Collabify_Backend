var logger 		= require('../logger');
var status		= require('../status');
var helpers		= require('./helpers');

module.exports.delete = function (req, res) {
	helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
		var userIdIndex = event.userIds.indexOf(user.userId);

		if (userIdIndex == -1) {
			logger.error('User not at event');
			return res.sendStatus(status.ERR_BAD_REQUEST);
		}

		// Remove the user from the event
		event.userIds.splice(userIdIndex, 1);
		event.save();

		user.eventId = null;
		user.role = 'NoRole';
		user.save();

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};