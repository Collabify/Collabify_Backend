var assert 				= require('assert');
var request 			= require('request');
var status				= require('../status.js');
var MAX_EVENT_DISTANCE 	= require('../controllers/events-controller').MAX_EVENT_DISTANCE;
var helpers				= require('./helpers');

var options = {
	url: 'http://localhost:1338/events/',
	json: true,
	headers: {
	}
};

describe('/events/', function () {
	describe('GET', function () {
		events = [
			{
				name: 'event1',
				eventId: '1',
				location: {
					latitude: 1,
					longitude: 1
				}
			},
			{
				name: 'event2',
				eventId: '2',
				location: {
					latitude: 1,
					longitude: 1 + (MAX_EVENT_DISTANCE + 1)
				}
			},
		];

		helpers.beforeAddEvents(events);
		helpers.afterRemoveAllEvents();

		it('should return events within MAX_EVENT_DISTANCE of the provided coordinates', function (done) {
			options.headers.latitude = 1;
			options.headers.longitude = 1 + (MAX_EVENT_DISTANCE + 1);

			request(options, function (err, res, body) {
				assert.ifError(err);
				assert.equal(res.statusCode, status.OK_GET_RESOURCE);

				// Expect only event2 to be returned
				assert.equal(body.length, 1);
				assert.equal(helpers.findEvent(body, '1'), null);
				assert.notEqual(helpers.findEvent(body, '2'), null);

				// Make sure the expected properties get returned
				body.forEach(function (returnedEvent) {
					var originalEvent = helpers.findEvent(events, returnedEvent.eventId);

					assert.equal(returnedEvent.name, originalEvent.name);
					assert.equal(returnedEvent.eventId, originalEvent.eventId);
					assert.equal(returnedEvent.location.latitude, originalEvent.location.latitude);
					assert.equal(returnedEvent.location.longitude, originalEvent.location.longitude);

					// password may be null
					assert.notStrictEqual(returnedEvent.settings.password, undefined);

					assert.notEqual(returnedEvent.settings.locationRestricted, undefined);
					assert.notEqual(returnedEvent.settings.allowVoting, undefined);
				});

				done();
			});
		});
	});
});