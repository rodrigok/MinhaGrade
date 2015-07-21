Meteor.methods
	'import': ->
		if not @userId
			return

		si = JSON.parse Assets.getText 'courses.json'

		Grade.remove {}

		for item in si
			Grade.insert item