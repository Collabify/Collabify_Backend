var logger 		= require('../logger');
var status		= require('../status');
var User		= require('../models/user').User;

module.exports.put = function (req, res) {
	User.update({userId: req.userId}, {role: req.body.role}, function (err, user) {
		if (err) {
			return status.handleUnexpectedError(err, res);
		}

		res.sendStatus(status.OK_UPDATE_RESOURCE);
	});
};