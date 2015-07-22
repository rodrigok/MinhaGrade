Meteor.methods
	removeCalendar: (calendarId) ->
		if not @userId?
			return

		user = Meteor.users.findOne @userId
		if user.admin isnt true
			return

		Calendar.remove
			_id: calendarId