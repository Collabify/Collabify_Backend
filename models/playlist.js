var SongSchema = require('./song').SongSchema;

/** @module */

/**
 * Playlist object definition
 *
 * @property {Song[]}	[songs=[]]	Array of song sub-documents
 */
module.exports.PlaylistDef = {
	songs: {type: [SongSchema], default: []}
};
