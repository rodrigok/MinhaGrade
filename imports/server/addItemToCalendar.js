import { Meteor } from 'meteor/meteor';
import { Calendar } from '../lib/collections';

Meteor.methods({
	addItemToCalendar(calendarId, gradeItemId, shift, day) {
		console.log('addItemToCalendar', calendarId, gradeItemId, shift, day);

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
				$not: {
					$elemMatch: {
						_id: gradeItemId,
						day,
						shift
					}
				}
			}
		};

		const update = {
			$push: {
				grade: {
					_id: gradeItemId,
					day,
					shift,
					interested: 0
				}
			}
		};

		return Calendar.update(query, update);
	}
});
