var logger 		= require('../logger');
var status		= require('../status');
var Event 		= require('../models/event').Event;

module.exports.post = function (req, res) {
	Event.findOne({eventId: req.body.eventId}, function (err, event) {
		if (event !== null) {
			logger.error("Event already exists");
			res.sendStatus(status.ERR_RESOURCE_EXISTS);
			return;
		}

		Event.create(req.body, function (err) {
			if (err) {
				logger.error(err);
				res.sendStatus(status.ERR_BAD_REQUEST);
				return;
			}

			res.sendStatus(status.OK_CREATE_RESOURCE);
		})
	});
};

module.exports.get = function (req, res) {
	Event
	.find()
	.select('name location')
	.where('location')
	.within()
	.circle({center: [req.body.latitude, req.body.longitude], radius: 10})
	.exec(function (err, events) {
		if (err) {
			logger.error(err);
			res.sendStatus(status.ERR_BAD_REQUEST);
			return;
		}

		if (events.length == 0) {
			logger.warn("No nearby events");
			res.sendStatus(status.ERR_RESOURCE_NOT_FOUND);
			return;
		}

		res.status(status.OK_GET_RESOURCE).send(events);
	});
};