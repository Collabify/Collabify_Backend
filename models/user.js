/**
 * User constructor.
 *
 * @constructor
 * @param {string} name
 * @param {string} userId - The Spotify ID for the user
 * @param {string} role - String identifying the user's role ('DJ', 'Collabifier', etc.)
 * @param {string} accessTokenDigest - Hashed copy of the access token
 * @param {string} refreshToken
 * @param {UserSettings} settings
 */
function User(name, userId, role, accessTokenDigest, refreshToken, settings) {
	this.name = name;
	this.userId = userId;
	this.role = role;
	this.hashedAccessToken = hashedAccessToken;
	this.refreshToken = refreshToken;
	this.settings = settings;
}

module.exports = User;