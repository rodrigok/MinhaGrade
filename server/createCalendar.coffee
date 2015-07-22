Meteor.methods
	createCalendar: (calendarId) ->
		if not @userId?
			return

		user = Meteor.users.findOne @userId
		if user.admin isnt true
			return

		Calendar.insert
			_id: calendarId
			grade: []