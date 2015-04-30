var SongDef         = require('./song').SongDef;
var SongSchema      = require('./song').SongSchema;

/** @module */

/**
 * Playlist object definition
 *
 * @property {Song}     [currentSong=null]      The currently playing song
 * @property {Song}     [nextSong=null]         The on-deck song, which will play after the current song finishes
 * @property {Song[]}   [songs=[]]              The rest of the songs in the playlist
 */
module.exports.PlaylistDef = {
    currentSong:    {type: SongDef, default: null},
    nextSong:       {type: SongDef, default: null},
    songs:          {type: [SongSchema], default: []}
};
