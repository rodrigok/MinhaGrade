import { Meteor } from 'meteor/meteor';
import { Calendar, Teachers, Grade } from '../../lib/collections';
import { isAuthenticatedResolver } from '../acl';
// import { createResolver, and } from 'apollo-resolvers';
// import { createError } from 'apollo-errors';

// const TeacherNameAlreadyExists = createError('TeacherNameAlreadyExists', {
// 	message: 'Teacher name already exists'
// });

// const checkIfNameAlreadyExists = createResolver((root, { name }) => {
// 	if (Calendar.findOne({ name })) {
// 		throw new TeacherNameAlreadyExists();
// 	}
// });

const findOne = (root, args) => {
	return Calendar.findOne({
		_id: args._id
	});
};

const find = () => {
	return Calendar.find().fetch();
};

// const add = (root, { name }) => {
// 	return Calendar.findOne(Calendar.insert({ name }));
// };

// const update = (root, { _id, name }) => {
// 	Calendar.update({ _id }, { $set: { name } });
// 	return Calendar.findOne(_id);
// };

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

export default {
	Query: {
		calendar: isAuthenticatedResolver.createResolver(findOne),
		calendars: isAuthenticatedResolver.createResolver(find)
	},
	Mutation: {
		// addCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(add),
		// updateCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(update)
		updateCalendarItemInterest: isAuthenticatedResolver.createResolver(updateCalendarItemInterest)
	},
	CalendarItem: {
		// _id needs to hava a unique identifier
		_id: ({ _id, shift, day }) => `${ _id }:${ shift }:${ day }`,
		teacher: ({ teacher }) => Teachers.findOne({ _id: teacher }),
		grade: ({ _id }, { course }, context) => {
			context.course = course;
			return Grade.findOne({ _id });
		}
	}
};
