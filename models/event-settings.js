/**
 * EventSettings constructor.
 *
 * @constructor
 * @param {string} password - The event password or null if there isn't one
 * @param {boolean} locationRestricted - Whether to restrict the event to nearby users
 * @param {boolean} allowVoting
 */
function EventSettings(password, locationRestricted, allowVoting) {
	this.password = password;
	this.locationRestricted = locationRestricted;
	this.allowVoting = allowVoting;
}

module.exports = EventSettings;