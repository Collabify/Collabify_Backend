/** @module */

/**
 * EventSettings object definition
 *
 * @property password				- The (optional) password for the event
 * @property locationRestricted		- Whether to restrict the event to nearby users
 * @property allowVoting			- Whether to allow users to vote on songs
 */
module.exports.EventSettingsDef = {
	password: 			{type: String, default: null},
	locationRestricted: {type: Boolean, default: true},
	allowVoting: 		{type: Boolean, default: true}
};
