var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

module.exports.post = function (req, res) {
	User.findOne({userId: req.body.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user !== null) {
			logger.error('User has already logged in');
			res.sendStatus(status.ERR_RESOURCE_EXISTS);
			return;
		}

		User.create(req.body, function (err) {
			if (err) {
				logger.error(err);
				res.sendStatus(status.ERR_BAD_REQUEST);
				return;
			}

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};