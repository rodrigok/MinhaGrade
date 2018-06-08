import { Calendar } from '../lib/collections';

Meteor.methods({
	setTeacherInCalendarItem(calendarId, gradeItemId, shift, day, teacher) {
		console.log('setTeacherInCalendarItem', calendarId, gradeItemId, shift, day, teacher);

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

		const update = {};

		if (teacher === '') {
			update.$unset = {
				'grade.$.teacher': 1
			};
		} else {
			update.$set = {
				'grade.$.teacher': teacher
			};
		}

		return Calendar.update(query, update);
	}
});
