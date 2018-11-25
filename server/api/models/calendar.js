import { _BaseModel } from './_Base';
import GradeModel from '../models/grade';
import UserModel from './user';
import TeacherModel from '../models/teacher';
import { sendPush } from '../../push';

class CalendarModel extends _BaseModel {
	constructor() {
		super('calendar');
	}

	updateCalendarItemInterest = (root, { calendarId, gradeItemId, shift, day, interested }, { userId }) => {
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
					shift,
				},
			},
		};

		update = {};
		update['grade.$.interested'] = count;

		return this.update(query, { $set: update }) === 1;
	}

	setTeacherInCalendarItem = (root, { calendarId, gradeItemId, shift, day, teacherId }) => {
		console.log('setTeacherInCalendarItem', calendarId, gradeItemId, shift, day, teacherId);

		const query = {
			_id: calendarId,
			grade: {
				$elemMatch: {
					_id: gradeItemId,
					day,
					shift,
				},
			},
		};

		const update = {};

		if (teacherId === '') {
			update.$unset = {
				'grade.$.teacher': 1,
			};
		} else {
			update.$set = {
				'grade.$.teacher': teacherId,
			};
		}

		const result = this.update(query, update) === 1;

		if (!result) {
			return result;
		}

		const users = UserModel.find({
			[`calendar.${ calendarId }`]: `${ shift }${ day }-${ gradeItemId }`,
		}, {
			fields: { _id: 1, 'profile.course': 1 },
		}).fetch();

		if (users.length) {
			const grade = GradeModel.findOne({ _id: gradeItemId });
			const teacher = teacherId !== '' && TeacherModel.findOne({ _id: teacherId });

			users.forEach((user) => {
				let pushMessage;
				if (teacherId === '') {
					pushMessage = `A matéria ${ grade.name[user.profile.course] } está sem professor(a)`;
				} else {
					pushMessage = `A matéria ${ grade.name[user.profile.course] } será ministrada por: ${ teacher.name }`;
				}

				sendPush({
					title: 'Professor alterado',
					body: pushMessage,
					userId: user._id,
				});
			});
		}

		return result;
	}

	setRoomInCalendarItem = (root, { calendarId, gradeItemId, shift, day, room }) => {
		console.log('setRoomInCalendarItem', calendarId, gradeItemId, shift, day, room);

		const query = {
			_id: calendarId,
			grade: {
				$elemMatch: {
					_id: gradeItemId,
					day,
					shift,
				},
			},
		};

		const update = {};

		if (room === '') {
			update.$unset = {
				'grade.$.room': 1,
			};
		} else {
			update.$set = {
				'grade.$.room': room,
			};
		}

		const result = this.update(query, update) === 1;

		if (!result) {
			return result;
		}

		const users = UserModel.find({
			[`calendar.${ calendarId }`]: `${ shift }${ day }-${ gradeItemId }`,
		}, {
			fields: { _id: 1, 'profile.course': 1 },
		}).fetch();

		if (users.length) {
			const grade = GradeModel.findOne({ _id: gradeItemId });

			users.forEach((user) => {
				let pushMessage;
				if (room === '') {
					pushMessage = `A matéria ${ grade.name[user.profile.course] } está sem sala definida`;
				} else {
					pushMessage = `A matéria ${ grade.name[user.profile.course] } será ministrada na sala ${ room }`;
				}

				sendPush({
					title: 'Sala alterada',
					body: pushMessage,
					userId: user._id,
				});
			});
		}

		return result;
	}

	removeItemFromCalendar = (root, { calendarId, gradeItemId, shift, day }) => {
		console.log('removeItemFromCalendar', calendarId, gradeItemId, shift, day);

		const query = {
			_id: calendarId,
			grade: {
				$elemMatch: {
					_id: gradeItemId,
					day,
					shift,
				},
			},
		};

		const update = {
			$pull: {
				grade: {
					_id: gradeItemId,
					day,
					shift,
				},
			},
		};

		return this.update(query, update);
	}

	addItemToCalendar = (root, { calendarId, gradeItemId, shift, day }) => {
		console.log('addItemToCalendar', calendarId, gradeItemId, shift, day);

		const query = {
			_id: calendarId,
			grade: {
				$not: {
					$elemMatch: {
						_id: gradeItemId,
						day,
						shift,
					},
				},
			},
		};

		const update = {
			$push: {
				grade: {
					_id: gradeItemId,
					day,
					shift,
					interested: 0,
				},
			},
		};

		return this.update(query, update);
	}
}

export default new CalendarModel();
