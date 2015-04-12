var mongoose	= require('mongoose');
var Event 		= require('../models/event').Event;

module.exports.addEvents = function (events, done) {
	Event.create(events, done);
};

module.exports.beforeAddEvents = function (events) {
	before('Add dummy events to database', function (done) {
		module.exports.addEvents(events, done);
	});
};

module.exports.removeAllEvents = function (done) {
	Event.remove({}, done);
};

module.exports.beforeRemoveAllEvents = function () {
	before('Remove stale events from database', module.exports.removeAllEvents);
};

module.exports.afterRemoveAllEvents = function () {
	after('Remove dummy events from database', module.exports.removeAllEvents);
};

module.exports.beforeConnect = function () {
	before('Connect to the database', function (done) {
		mongoose.connect('mongodb://localhost/test');
		mongoose.connection.once('open', done);
	})
};

module.exports.indexOfEvent = function (events, eventId) {
	eventIds = events.map(function (event) {
		return event.eventId;
	});

	return eventIds.indexOf(eventId);
};

module.exports.findEvent = function (events, eventId) {
	var index = module.exports.indexOfEvent(events, eventId);

	if (index == -1) {
		return null;
	}

	return events[index];
};