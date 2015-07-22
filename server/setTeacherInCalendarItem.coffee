Meteor.methods
	setTeacherInCalendarItem: (calendarId, gradeItemId, shift, day, teacher) ->
		if not @userId?
			return

		user = Meteor.users.findOne @userId
		if user.admin isnt true
			return

		query =
			_id: calendarId
			grade:
				$elemMatch:
					_id: gradeItemId
					day: day
					shift: shift

		update = {}
		update['grade.$.teacher'] = teacher

		Calendar.update query, $set: update