var helpers		= require('./helpers');

module.exports.put = function (req, res) {
	// First make sure the DJ is the one making the request
	helpers.getEventAsDJ(req.headers.userid, req.eventId, res, function () {
		// Make sure the affected user is at the event
		helpers.getUserAtEvent(req.userId, req.eventId, res, function (user, event) {
			user.role = req.body;
			res.sendStatus(status.OK_UPDATE_RESOURCE);
		});
	});
};