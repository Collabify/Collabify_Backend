var Playlist = require('./playlist');

/**
 * Event constructor that creates an event with an empty playlist.
 *
 * @constructor
 * @param {string} name
 * @param {string} eventId - The Spotify ID of the DJ who created the event
 * @param {EventSettings} settings
 * @param {Location} location
 */
function Event(name, eventId, numUsers, settings, location) {
	this.title = title;
	this.eventId = eventId;
	this.numUsers = numUsers;
	this.settings = settings;
	this.location = location;
	this.playlist = new Playlist();
}

module.exports = Event;