var Song = require('./models/song');
var User = require('./models/user');
var UserSettings = require('./models/user-settings');
var Event = require('./models/event');
var EventSettings = require('./models/event-settings');
var Location = require('./models/location');
var Playlist = require('./models/playlist');

module.exports.songs = [
	new Song(
		'Protest and Survive',
		'Discharge',
		'Hear Nothing See Nothing Say Nothing',
		1983,
		'1G7HcwXzFxgfNehxGVRL6T',
		'https://i.scdn.co/image/bb8a103778d323a1c8d739bd2842ce23028a355e',
		'1214541369'
	),
	new Song(
		'A Dangerous Meeting',
		'Mercyful Fate',
		'Don\'t Break the Oath',
		1984,
		'2hsNfW4fcDhQtXiyMEGvUc',
		'https://i.scdn.co/image/cbac4f15d064ae886e33ab34a67d881f38a9a03a',
		'1214541369'
	),
	new Song(
		'Clockwerk',
		'Current Value',
		'Back to the Machine',
		2010,
		'6jhPQnMVlPDl0a4NG2Lz3U',
		'https://i.scdn.co/image/31ff1d22a1ef2e8c6efc48e5bd8636c1c92d5caf',
		'1214541369'
	),
	new Song(
		'Paragon Pusher',
		'Mammoth Grinder',
		'Underworlds',
		2013,
		'6GFfuW4PsujKvcN2HBKt4O',
		'https://i.scdn.co/image/ea0691e11852cea3e30b147e736b7466c26020c4',
		'1214541369'
	),
	new Song(
		'Ghosts',
		'Monolake',
		'Ghosts',
		2012,
		'6gDuOfKaheLOtJUirnTgul',
		'https://i.scdn.co/image/4577a1255390892fe400b66f169f233281c94a96',
		'1214541369'
	)
];
module.exports.songs[0].votes = 0;
module.exports.songs[1].votes = 1;
module.exports.songs[2].votes = 2;
module.exports.songs[3].votes = 3;
module.exports.songs[4].votes = 3;

module.exports.users = [
	new User(
		'John Doe',
		'0123456789',
		'DJ',
		'2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
		'2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892',
		new UserSettings(true)
	),
	new User(
		'Jane Doe',
		'9876543210',
		'Collabifier',
		'2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
		'2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892',
		new UserSettings(true)
	),
	new User(
		'Sydney Johnson',
		'1214541369',
		'Blacklisted',
		'2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
		'2413fb3709b05939f04cf2e92f7d0897fc2596f9ad0b8a9ea855c7bfebaae892',
		new UserSettings(true)
	)
];

module.exports.events = [
	new Event(
		'Party1',
		'0123456789',
		new EventSettings(null, true, true),
		new Location(43.0715, -89.4045)
	),
	new Event(
		'Party2',
		'0123456789',
		new EventSettings('$$$', true, true),
		new Location(71.2546, -179.4)
	)
];
module.exports.events[0].playlist.songs = module.exports.songs.slice(2);
module.exports.events[0].users = module.exports.users.slice(1);
module.exports.events[1].playlist.songs = module.exports.songs;
module.exports.events[1].users = module.exports.users;