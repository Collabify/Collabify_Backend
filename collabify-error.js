var logger = require('./logger');

/** @module */

/**
 * CollabifyError constructor, which logs the error
 *
 * @param {Number}	statusCode	The HTTP status code associated with the error
 * @param {String}	message		The message describing the error
 * @return {CollabifyError}		A new CollabifyError object
 */
module.exports = function (statusCode, message) {
	this.statusCode = statusCode;
	this.message = message;

	logger.error(message);
}

/**
 * Send the error as a server response
 *
 * @param res The server response object
 */
module.exports.prototype.send = function (res) {
	return res.status(this.statusCode).send(this.message);
}