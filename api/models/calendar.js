import { _BaseModel } from './_Base';
import UserModel from './user';

class CalendarModel extends _BaseModel {
	constructor() {
		super('calendar');
	}

	updateCalendarItemInterest(root, { calendarId, gradeItemId, shift, day, interested }, { userId }) {
		console.log('updateCalendarItemInterest', calendarId, gradeItemId, shift, day, interested);

		let update = {};
		update[`calendar.${ calendarId }`] = `${ shift }${ day }-${ gradeItemId }`;

		if (interested === true) {
			UserModel.update(userId, { $push: update });
		} else {
			UserModel.update(userId, { $pull: update });
		}

		const count = UserModel.find(update, { fields: { _id: 1 } }).count();

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

		return this.update(query, { $set: update }) === 1;
	}

	setTeacherInCalendarItem(root, { calendarId, gradeItemId, shift, day, teacherId }) {
		console.log('setTeacherInCalendarItem', calendarId, gradeItemId, shift, day, teacherId);

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

		if (teacherId === '') {
			update.$unset = {
				'grade.$.teacher': 1
			};
		} else {
			update.$set = {
				'grade.$.teacher': teacherId
			};
		}

		return this.update(query, update) === 1;
	}

	removeItemFromCalendar(root, { calendarId, gradeItemId, shift, day }) {
		console.log('removeItemFromCalendar', calendarId, gradeItemId, shift, day);

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

		return this.update(query, update);
	}

	addItemToCalendar(root, { calendarId, gradeItemId, shift, day }) {
		console.log('addItemToCalendar', calendarId, gradeItemId, shift, day);

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

		return this.update(query, update);
	}
}

export default new CalendarModel();
