module.exports.songs = [
	{
		title: 'Protest and Survive',
		artist: 'Discharge',
		album: 'Hear Nothing See Nothing Say Nothing',
		year: 1983,
		songId: '1G7HcwXzFxgfNehxGVRL6T',
		artworkUrl: 'https://i.scdn.co/image/bb8a103778d323a1c8d739bd2842ce23028a355e',
		userId: '1214541369'
	},
	{
		title: 'A Dangerous Meeting',
		artist: 'Mercyful Fate',
		album: 'Don\'t Break the Oath',
		year: 1984,
		songId: '2hsNfW4fcDhQtXiyMEGvUc',
		artworkUrl: 'https://i.scdn.co/image/cbac4f15d064ae886e33ab34a67d881f38a9a03a',
		userId: '1214541369'
	},
	{
		title: 'Clockwerk',
		artist: 'Current Value',
		album: 'Back to the Machine',
		year: 2010,
		songId: '6jhPQnMVlPDl0a4NG2Lz3U',
		artworkUrl: 'https://i.scdn.co/image/31ff1d22a1ef2e8c6efc48e5bd8636c1c92d5caf',
		userId: '1214541369'
	},
	{
		title: 'Paragon Pusher',
		artist: 'Mammoth Grinder',
		album: 'Underworlds',
		year: 2013,
		songId: '6GFfuW4PsujKvcN2HBKt4O',
		artworkUrl: 'https://i.scdn.co/image/ea0691e11852cea3e30b147e736b7466c26020c4',
		userId: '1214541369'
	},
	{
		title: 'Ghosts',
		artist: 'Monolake',
		album: 'Ghosts',
		year: 2012,
		songId: '6gDuOfKaheLOtJUirnTgul',
		artworkUrl: 'https://i.scdn.co/image/4577a1255390892fe400b66f169f233281c94a96',
		userId: '1214541369'
	}
];

module.exports.users = [
	{
		name: 'John Doe',
		userId: '0123456789',
		role: 'DJ',
		settings: {
			showName: true
		}
	},
	{
		name: 'Jane Doe',
		userId: '9876543210',
		role: 'Collabifier',
		settings: {
			showName: true
		}
	},
	{
		name: 'Sydney Johnson',
		userId: '1214541369',
		role: 'Blacklisted',
		settings: {
			showName: true
		}
	}
];

module.exports.events = [
	{
		name: 'Party1',
		eventId: '0123456789',
		userIds: module.exports.users.slice(1).map(function (user) {return user.userId}),
		location: {
			latitude: 43.0715,
			longitude: -89.4045
		},
		playlist: {
			songs: module.exports.songs.slice(2)
		},
		settings: {
			password: null,
			locationRestricted: true,
			allowVoting: true
		}
	},
	{
		name: 'Party2',
		eventId: '0123456789',
		userIds: module.exports.users.slice(1).map(function (user) {return user.userId}),
		location: {
			latitude: 71.2546,
			longitude: -179.4
		},
		playlist: {
			songs: module.exports.songs
		},
		settings: {
			password: '$$$',
			locationRestricted: true,
			allowVoting: true
		}
	}
];
