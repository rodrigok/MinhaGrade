Meteor.methods
	updateCalendarItemInterest: (calendarId, gradeItemId, shift, day, interested) ->
		if not this.userId?
			return

		update = {}
		update["calendar.#{calendarId}"] = "#{shift}#{day}-#{gradeItemId}"

		if interested is true
			Meteor.users.update(this.userId, $push: update)
		else
			Meteor.users.update(this.userId, $pull: update)
