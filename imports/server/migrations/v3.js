Migrations.add({
	version: 3,
	up() {
		return Meteor.users.update({calendar: null}, {$unset: {calendar: 1}}, {multi: true});
	}});