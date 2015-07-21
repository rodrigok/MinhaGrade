Migrations.add
	version: 1,
	up: ->
		courses = JSON.parse Assets.getText 'courses.json'

		Grade.remove {}

		for item in courses
			Grade.insert item