Blaze.registerHelper 'getCourse', (obj) ->
	grade = Session.get('grade').toUpperCase()

	if Match.test obj, Object
		return obj[grade]

	return
