Meteor.methods({
	createCalendar(calendarId) {
		console.log('createCalendar', calendarId);

		if ((this.userId == null)) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Calendar.insert({
			_id: calendarId,
			grade: []});
	}});