var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

module.exports.get = function (req, res) {
	User.findOne({userId: req.userId}, 'name userId eventId role settings', function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user == null) {
			logger.warn('No user found');
			res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			return;
		}

		res.status(status.OK_GET_RESOURCE).send(user);
	});
};

module.exports.delete = function (req, res) {
	User.remove({userId: req.userId}, function (err) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_DELETE_RESOURCE);
	});
};