/**
 * Location constructor for locations described by latitude and longitude (in
 * degrees).
 *
 * @constructor
 * @param {number} latitude
 * @param {number} longitude
 */
function Location(latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}

module.exports = Location;