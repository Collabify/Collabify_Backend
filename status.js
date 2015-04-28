var logger	= require('./logger');

/** @module */

module.exports = {
	/** @todo Update these codes to better reflect the status */
	OK_GET_RESOURCE: 200,
	OK_CREATE_RESOURCE: 200,
	OK_UPDATE_RESOURCE: 200,
	OK_DELETE_RESOURCE: 200,

	ERR_UNAUTHORIZED: 401,
	ERR_RESOURCE_EXISTS: 403,
	ERR_RESOURCE_NOT_FOUND: 404,
	ERR_BAD_REQUEST: 400,
};