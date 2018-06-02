import {Calendar} from '../lib/collections';

Meteor.methods({
	removeCalendar(calendarId) {
		console.log('removeCalendar', calendarId);

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Calendar.remove({
			_id: calendarId});
	}
});
