var mongoose 	= require('mongoose');
var Schema		= mongoose.Schema;
var VoteDef 	= require('./vote').VoteDef;

/** @module */

/**
 * Song object definition
 *
 * @property {String} 	title			The title of the song
 * @property {String} 	artist			The name of the artist
 * @property {String} 	album			The name of the album the song appears on
 * @property {Number}	year			The year the song was released
 * @property {String} 	songId			The Spotify ID for the song
 * @property {String} 	artworkUrl		The URL where the album art can be found
 * @property {String} 	userId			The Spotify ID of the user who added the song
 * @property {Number} 	[voteCount=0]	The song's current number of (upvotes - downvotes)
 * @property {Vote[]}	votes			The individual votes placed by each user
 */
module.exports.SongDef = {
	title: 		{type: String, required: true},
	artist: 	{type: String, required: true},
	album: 		{type: String, required: true},
	year: 		{type: Number, required: true},
	songId: 	{type: String, required: true},
	artworkUrl: {type: String, required: true},
	userId: 	{type: String, required: true},
	voteCount: 	{type: Number, required: true},
	votes: 		{type: [VoteDef], default: []}
};

/** Song document schema */
module.exports.SongSchema = new Schema(module.exports.SongDef);
