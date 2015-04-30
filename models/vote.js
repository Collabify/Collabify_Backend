/** @module */

/**
 * Vote object definition
 *
 * Note that the song cannot be upvoted and downvoted simultaneously by a single user.
 *
 * @property {String}   userId          The Spotify ID of the user who placed this vote
 * @property {Boolean}  isUpvoted       Whether the user has upvoted the song
 * @property {Boolean}  isDownvoted     Whether the user has downvoted the song
 */
module.exports.VoteDef = {
    userId:         {type: String, required: true},
    isUpvoted:      {type: Boolean, required: true},
    isDownvoted:    {type: Boolean, required: true}
};