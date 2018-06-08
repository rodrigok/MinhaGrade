import { Calendar } from '../lib/collections';

Meteor.methods({
	updateCalendarItemInterest(calendarId, gradeItemId, shift, day, interested) {
		console.log('updateCalendarItemInterest', calendarId, gradeItemId, shift, day, interested);

		if (this.userId == null) {
			return;
		}

		let update = {};
		update[`calendar.${ calendarId }`] = `${ shift }${ day }-${ gradeItemId }`;

		if (interested === true) {
			Meteor.users.update(this.userId, { $push: update });
		} else {
			Meteor.users.update(this.userId, { $pull: update });
		}

		const count = Meteor.users.find(update, { fields: { _id: 1 } }).count();

		const query = {
			_id: calendarId,
			grade: {
				$elemMatch: {
					_id: gradeItemId,
					day,
					shift
				}
			}
		};

		update = {};
		update['grade.$.interested'] = count;

		return Calendar.update(query, { $set: update });
	}
});
