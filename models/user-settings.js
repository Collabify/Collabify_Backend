/**
 * UserSettings constructor.
 *
 * @constructor
 * @param {boolean} showName - Whether to display the user's Spotify username or 'anonymous'
 */
function UserSettings(showName) {
	this.showName = showName;
}

module.exports = UserSettings;