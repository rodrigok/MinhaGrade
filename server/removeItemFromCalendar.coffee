Meteor.methods
	removeItemFromCalendar: (calendarId, gradeItemId, shift, day) ->
		if not @userId?
			return

		user = Meteor.user.find @userId
		if user.admin isnt true
			return

		query =
			_id: calendarId
			grade:
				$elemMatch:
					_id: gradeItemId
					day: day
					shift: shift

		update =
			$pull:
				grade:
					_id: gradeItemId
					day: day
					shift: shift

		Calendar.update query, update