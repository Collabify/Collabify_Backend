var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;

/** @module */

/**
 * Song object definition
 *
 * @property title		- The title of the song
 * @property artist		- The name of the artist
 * @property album		- The name of the album the song appears on
 * @property year		- The year the song was released
 * @property songId		- The Spotify ID for the song
 * @property artworkUrl	- The URL where the album art can be found
 * @property userId		- The Spotify ID of the user who added the song
 * @property votes		- The song's current number of (upvotes - downvotes)
 */
module.exports.SongDef = {
	title: 		{type: String, required: true},
	artist: 	{type: String, required: true},
	album: 		{type: String, required: true},
	year: 		{type: Number, required: true},
	songId: 	{type: String, required: true},
	artworkUrl: {type: String, required: true},
	userId: 	{type: String, required: true},
	/** @todo Implement votes on a user basis */
	votes: 		{type: Number, min: 0, default: 0}
};

/** Song document schema */
module.exports.SongSchema = new Schema(module.exports.SongDef);
