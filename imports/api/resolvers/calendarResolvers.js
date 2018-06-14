import { Meteor } from 'meteor/meteor';
import { Calendar, Teachers, Grade } from '../../lib/collections';
import { isAuthenticatedResolver, isAdminResolver } from '../acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const NameAlreadyExists = createError('NameAlreadyExists', {
	message: 'Name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (Calendar.findOne({ name })) {
		throw new NameAlreadyExists();
	}
});

const findOne = (root, args) => {
	return Calendar.findOne({
		_id: args._id
	});
};

const find = () => {
	return Calendar.find().fetch();
};

const updateCalendarItemInterest = (root, { calendarId, gradeItemId, shift, day, interested }, { userId }) => {
	console.log('updateCalendarItemInterest', calendarId, gradeItemId, shift, day, interested);

	let update = {};
	update[`calendar.${ calendarId }`] = `${ shift }${ day }-${ gradeItemId }`;

	if (interested === true) {
		Meteor.users.update(userId, { $push: update });
	} else {
		Meteor.users.update(userId, { $pull: update });
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

	return Calendar.update(query, { $set: update }) === 1;
};

const setTeacherInCalendarItem = (root, { calendarId, gradeItemId, shift, day, teacherId }) => {
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

	return Calendar.update(query, update) === 1;
};

const removeItemFromCalendar = (root, { calendarId, gradeItemId, shift, day }) => {
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

	return Calendar.update(query, update);
};

const addItemToCalendar = (root, { calendarId, gradeItemId, shift, day }) => {
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

	return Calendar.update(query, update);
};

const createCalendar = (root, { name }) => {
	return Calendar.findOne(Calendar.insert({ name, grade: [] }));
};

const updateCalendar = (root, { _id, name }) => {
	Calendar.update({ _id }, { $set: { name } });
	return Calendar.findOne({ _id });
};

const removeCalendar = (root, { _id }) => {
	return Calendar.remove({ _id });
};

export default {
	Query: {
		calendar: isAuthenticatedResolver.createResolver(findOne),
		calendars: isAuthenticatedResolver.createResolver(find)
	},
	Mutation: {
		createCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(createCalendar),
		updateCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(updateCalendar),
		removeCalendar: and(isAdminResolver)(removeCalendar),
		updateCalendarItemInterest: isAuthenticatedResolver.createResolver(updateCalendarItemInterest),
		setTeacherInCalendarItem: and(isAdminResolver)(setTeacherInCalendarItem),
		removeItemFromCalendar: and(isAdminResolver)(removeItemFromCalendar),
		addItemToCalendar: and(isAdminResolver)(addItemToCalendar)
	},
	CalendarItem: {
		// _id needs to hava a unique identifier
		_id: ({ _id, shift, day }) => `${ _id }:${ shift }:${ day }`,
		teacher: ({ teacher }) => Teachers.findOne({ _id: teacher }),
		grade: ({ _id }) => {
			return Grade.findOne({ _id });
		}
	}
};
