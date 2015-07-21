Meteor.startup ->
	Migrations.migrateTo 'latest'

Meteor.methods
	migrateTo: (version) ->
		if not @userId
			return

		Migrations.migrateTo version