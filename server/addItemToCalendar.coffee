Meteor.methods
	addItemToCalendar: (calendarId, gradeItemId, shift, day) ->
		if not @userId?
			return

		user = Meteor.users.findOne @userId
		if user.admin isnt true
			return

		query =
			_id: calendarId
			grade:
				$not:
					$elemMatch:
						_id: gradeItemId
						day: day
						shift: shift

		update =
			$push:
				grade:
					_id: gradeItemId
					day: day
					shift: shift
					interested: 0

		Calendar.update query, update