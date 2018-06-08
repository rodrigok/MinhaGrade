import { Calendar, Teachers } from '../../lib/collections';
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

export default {
	Query: {
		calendars: isAuthenticatedResolver.createResolver(find)
	},
	Mutation: {
		// addCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(add),
		// updateCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(update)
	},
	CalendarItem: {
		teacher: ({ teacher }) => Teachers.findOne({ _id: teacher })
	}
};
