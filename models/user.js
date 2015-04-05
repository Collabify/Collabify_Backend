var mongoose 			= require('mongoose');
var Schema				= mongoose.Schema;
var UserSettingsDef		= require('./user-settings').UserSettingsDef;

/** @module */

/**
 * User object definition
 *
 * @property name		- The user's Spotify display name
 * @property userId		- The Spotify ID for the user
 * @property role		- String identifying the user's role ('DJ', 'Collabifier', etc.)
 * @property settings	- The user's current settings
 */
module.exports.UserDef = {
	name: 		{type: String, required: true},
	userId: 	{type: String, required: true},
	role: 		{type: String, default: 'Collabifier'},
	/** @todo Uncomment when authentication is implemented */
	// accessTokenDigest: {type: String, required: true},
	// refreshToken: {type: String, required: true},
	settings: 	UserSettingsDef
};

/** User document schema */
module.exports.UserSchema = new Schema(module.exports.UserDef);

/** User model */
module.exports.User = mongoose.model('User', module.exports.UserSchema);
