import CalendarModel from '../models/calendar';
import TeacherModel from '../models/teacher';
import GradeModel from '../models/grade';
import UserModel from '../models/user';
import { isAuthenticatedResolver, isAdminResolver } from '/api/acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const NameAlreadyExists = createError('NameAlreadyExists', {
	message: 'Name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (CalendarModel.findOne({ name })) {
		throw new NameAlreadyExists();
	}
});

const findOne = (root, args) => {
	return CalendarModel.findOne({
		_id: args._id
	});
};

export default {
	Query: {
		calendar: findOne,
		calendars: isAuthenticatedResolver.createResolver(CalendarModel.resolverFindAll)
	},
	Mutation: {
		createCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(CalendarModel.mutationCreate),
		updateCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(CalendarModel.mutationUpdate),
		removeCalendar: and(isAdminResolver)(CalendarModel.mutationRemove),
		updateCalendarItemInterest: isAuthenticatedResolver.createResolver(CalendarModel.updateCalendarItemInterest),
		setTeacherInCalendarItem: and(isAdminResolver)(CalendarModel.setTeacherInCalendarItem),
		removeItemFromCalendar: and(isAdminResolver)(CalendarModel.removeItemFromCalendar),
		addItemToCalendar: and(isAdminResolver)(CalendarModel.addItemToCalendar)
	},
	CalendarItem: {
		// _id needs to hava a unique identifier
		_id: ({ _id, shift, day }) => `${ _id }:${ shift }:${ day }`,
		teacher: ({ teacher }) => TeacherModel.findOne({ _id: teacher }),
		grade: ({ _id }, { course }, context) => {
			if (course) {
				context.course = course;
			} else if (context.userId) {
				context.course = UserModel.findOne(context.userId).profile.course;
			}

			return GradeModel.findOne({ _id });
		},
		userStatus: ({ _id }, args, { userId }) => {
			if (!userId) {
				return;
			}

			const user = UserModel.findOne({
				_id: userId,
				[`grade.${ _id }`]: {
					$exists: true
				}
			}, { grade: 1 });

			if (user) {
				return user.grade[_id];
			}
		},
		userInterested: ({ _id, shift, day }, args, { userId }) => {
			if (!userId) {
				return false;
			}

			const key = `${ shift }${ day }-${ _id }`;

			const user = UserModel.findOne({
				_id: userId,
				['calendar.2018-2']: key
			}, { fields: { grade: 1 } });

			if (user) {
				return true;
			}
		}
	}
};
