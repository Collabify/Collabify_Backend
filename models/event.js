var mongoose 			= require('mongoose');
var Schema				= mongoose.Schema;
var EventSettingsDef	= require('./event-settings').EventSettingsDef;
var LocationDef			= require('./location').LocationDef;
var PlaylistDef 		= require('./playlist').PlaylistDef;

/** @module */

/**
 * Event object definition
 *
 * @property name		- The name of the event
 * @property eventId	- The Spotify ID of the DJ who created the event
 * @property userIds	- The Spotify IDs of the users currently at the event
 * @property location	- The event's location
 * @property playlist	- The event's current playlist
 * @property settings	- The settings for the event
 */
module.exports.EventDef = {
	name: 		{type: String, required: true},
	eventId: 	{type: String, required: true},
	userIds: 	{type: [String], default: []},
	location: 	LocationDef,
	playlist: 	PlaylistDef,
	settings: 	EventSettingsDef
};

/** Event document schema */
module.exports.EventSchema = new Schema(module.exports.EventDef);

/** Event model */
module.exports.Event = mongoose.model('Event', module.exports.EventSchema);
