var mongoose 			= require('mongoose');
var Schema				= mongoose.Schema;
var UserSettingsDef		= require('./user-settings').UserSettingsDef;

/** @module */

/**
 * User object definition
 *
 * @property {String} 			name				The user's Spotify display name
 * @property {String} 			userId				The Spotify ID for the user
 * @property {String} 			[eventId=null]		The ID of the event the user is at, or null if they aren't at one
 * @property {String} 			[role='NoRole']		String identifying the user's role ('NoRole', 'DJ', 'Collabifier', etc.)
 * @property {UserSettings}		settings			The user's current settings
 */
module.exports.UserDef = {
	name: 		{type: String, required: true},
	userId: 	{type: String, required: true},
	eventId: 	{type: String, default: null},
	role: 		{type: String, default: 'NoRole'},
	/** @todo Uncomment when authentication is implemented */
	// accessTokenDigest: {type: String, required: true},
	// refreshToken: {type: String, required: true},
	settings: 	UserSettingsDef
};

/** User document schema */
module.exports.UserSchema = new Schema(module.exports.UserDef);

/** User model */
module.exports.User = mongoose.model('User', module.exports.UserSchema);
