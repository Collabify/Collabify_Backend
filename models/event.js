var mongoose 			= require('mongoose');
var Schema				= mongoose.Schema;
var EventSettingsDef	= require('./event-settings').EventSettingsDef;
var LocationDef			= require('./location').LocationDef;
var PlaylistDef 		= require('./playlist').PlaylistDef;

/** @module */

/**
 * Event object definition
 *
 * @property {String}			name				The name of the event
 * @property {String}			eventId				The Spotify ID of the DJ who created the event
 * @property {String[]}			[userIds=[]]		The Spotify IDs of the users currently at the event
 * @property {Location}			location			The event's latitude and longitude
 * @property {Playlist}			playlist			The event's current playlist
 * @property {EventSettings}	settings			The settings for the event
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
