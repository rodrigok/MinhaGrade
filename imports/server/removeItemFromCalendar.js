import { Meteor } from 'meteor/meteor';
import { Calendar } from '../lib/collections';

Meteor.methods({
	removeItemFromCalendar(calendarId, gradeItemId, shift, day) {
		console.log('removeItemFromCalendar', calendarId, gradeItemId, shift, day);

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

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

		const update = {
			$pull: {
				grade: {
					_id: gradeItemId,
					day,
					shift
				}
			}
		};

		return Calendar.update(query, update);
	}
});
