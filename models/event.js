var Playlist = require('./playlist');

/**
 * Event constructor that creates an event with an empty playlist and no users.
 *
 * @constructor
 * @param {string} name
 * @param {string} eventId - The Spotify ID of the DJ who created the event
 * @param {EventSettings} settings
 * @param {Location} location
 */
function Event(name, eventId, settings, location) {
	this.name = name;
	this.eventId = eventId;
	this.settings = settings;
	this.location = location;
	this.numUsers = 0;
	this.playlist = new Playlist();
	this.users = [];
}

module.exports = Event;