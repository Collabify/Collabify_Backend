var logger 		= require('../logger');
var status		= require('../status');
var User 		= require('../models/user').User;

module.exports.post = function (req, res) {
	User.findOne({userId: req.body.user.userId}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		} else if (user !== null) {
			logger.error('User has already logged in');
			return res.sendStatus(status.ERR_RESOURCE_EXISTS);
		}

		User.create(req.body.user, function (err) {
			if (err) {
				logger.error(err);
				return res.sendStatus(status.ERR_BAD_REQUEST);
			}

			res.sendStatus(status.OK_CREATE_RESOURCE);
		});
	});
};