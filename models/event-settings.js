/** @module */

/**
 * EventSettings object definition
 *
 * @property {String}   [password=null]                 The (optional) password for the event
 * @property {Boolean}  [locationRestricted=true]       Whether to restrict the event to nearby users
 * @property {Boolean}  [allowVoting=true]              Whether to allow users to vote on songs
 */
module.exports.EventSettingsDef = {
    password:           {type: String, default: null},
    locationRestricted: {type: Boolean, default: true},
    allowVoting:        {type: Boolean, default: true}
};
