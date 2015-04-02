/**
 * Song constructor that initializes the song to have no votes.
 *
 * @constructor
 * @param {string} title
 * @param {string} artist
 * @param {string} album
 * @param {number} year
 * @param {string} songId - The Spotify ID for the song
 * @param {string} artworkUrl - The URL where the album art can be found
 * @param {string} userId - The Spotify ID of the user who added the song
 */
function Song(title, artist, album, year, songId, artworkUrl, userId) {
	this.title = title;
	this.artist = artist;
	this.album = album;
	this.year = year;
	this.songId = songId;
	this.artworkUrl = artworkUrl;
	this.userId = userId;
	this.votes = 0;
}

module.exports = Song;